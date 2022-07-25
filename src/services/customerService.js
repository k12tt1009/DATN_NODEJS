import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

import bcrypt from 'bcryptjs';
import { reject } from "lodash";

const salt = bcrypt.genSaltSync(10);

let buildUrlEmail = (staffId, token) => {

    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&staffId=${staffId}`

    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.staffId || !data.timeType || !data.date
                || !data.address
            ) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số đầu vào'
                })
            }

            // upsert customer
            let customer = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: 'R3',
                    address: data.address,
                    firstName: data.firstName,
                    lastName: data.lastName
                },
            });

            const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

            const bookings = await db.Booking.findAndCountAll({ where: { statusId: "S2", customerId: customer[0].id, date: data.date, timeType: data.timeType } });

            const staffBookings = await db.Booking.findAndCountAll({ where: { statusId: "S2", staffId: data.staffId, date: data.date, timeType: data.timeType } });

            if (bookings.count > 0)
                return resolve({
                    errCode: 2,
                    errMessage: 'Bạn đã đặt khung giờ này cho một nhân viên bảo dưỡng khác!',
                    data: bookings,
                });

            if (staffBookings.count >= MAX_NUMBER_SCHEDULE)
                return resolve({
                    errCode: 2,
                    errMessage: 'Nhân viên này hiện tại đang bận!',
                    data: bookings,
                });

            let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

            await emailService.sendSimpleEmail({
                receiverEmail: data.email,
                customerName: data.lastName,
                time: data.timeString,
                staffName: data.staffName,
                redirectLink: buildUrlEmail(data.staffId, token)
            })

            //create a booking record
            if (customer && customer[0]) {
                await db.Booking.create({
                    statusId: 'S1',
                    staffId: data.staffId,
                    staffName: data.staffName,
                    customerId: customer[0].id,
                    firstNameCustomer: data.firstName,
                    lastNameCustomer: data.lastName,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    licensePlates: data.licensePlates,
                    typeCar: data.typeCar,
                    note: data.note,
                    date: data.date,
                    timeType: data.timeType,
                    token: token
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Đặt lịch bảo dưỡng thành công!'
            })

        } catch (e) {
            reject(e);
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.staffId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số đầu vào'
                })
            }

            const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

            const booking = (await db.Booking.findAndCountAll({ where: { token: data.token } })).rows[0];

            const bookings = await db.Booking.findAndCountAll({ where: { statusId: "S2", customerId: booking.customerId, date: booking.date, timeType: booking.timeType } });

            const staffBookings = await db.Booking.findAndCountAll({ where: { statusId: "S2", staffId: booking.staffId, date: booking.date, timeType: booking.timeType } });

            if (bookings.count > 0)
                return resolve({
                    errCode: -1,
                    errMessage: 'Bạn đã đặt khung giờ này cho một nhân viên bảo dưỡng khác!',
                    data: bookings,
                });

            if (staffBookings.count >= MAX_NUMBER_SCHEDULE)
                return resolve({
                    errCode: 3,
                    errMessage: 'Nhân viên này hiện tại đang bận!',
                    data: bookings,
                });

            let appointment = await db.Booking.findOne({
                where: {
                    staffId: data.staffId,
                    token: data.token,
                    statusId: 'S1'
                },
                raw: false
            })

            if (appointment) {
                appointment.statusId = 'S2';
                await appointment.save()
                resolve({
                    errCode: 0,
                    errMessage: 'Xác nhận lịch hẹn thành công!'
                })
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Lịch hẹn đã được xác nhận hoặc không tồn tại.'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hasPassword = await bcrypt.hashSync(password, salt);
            resolve(hasPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let handleCustomerLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customerData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                //customer already exist

                let customer = await db.User.findOne({
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (customer) {
                    //compare password
                    let check = await bcrypt.compareSync(password, customer.password);
                    if (check) {
                        customerData.errCode = 0;
                        customerData.errMessage = 'Ok';
                        delete customer.password;
                        customerData.customer = customer;
                    } else {
                        customerData.errCode = 3;
                        customerData.errMessage = 'Mật khẩu không chính xác. Vui lòng kiểm tra lại!';
                    }
                } else {
                    customerData.errCode = 2;
                    customerData.errMessage = 'Người dùng không tồn tại. Vui lòng kiểm tra lại';
                }

            } else {
                //return error
                customerData.errCode = 1;
                customerData.errMessage = 'Email không tồn tại. Vui lòng kiểm tra lại';

            }
            resolve(customerData)
        } catch (e) {
            reject(e)
        }
    })
}

let checkUserEmail = (customerEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let customer = await db.User.findOne({
                where: { email: customerEmail }
            })
            if (customer) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

let handleCustomerRegister = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist ?
            let check = await checkUserEmail(data.email);

            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email đã tồn tại. Vui lòng thử email khác!'
                })
            } else {
                let hasPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hasPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    // address: data.address,
                    // phonenumber: data.phonenumber,
                    roleId: 'R3',
                })

                resolve({
                    errCode: 0,
                    message: 'Tạo người dùng thành công!'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getListBookingCustomer = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số đầu vào'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        customerId: inputId
                    },
                    include: [

                        { model: db.Allcode, as: 'statusDataCustomer', attributes: ['valueEn', 'valueVi'] },

                    ],
                    order: [['createdAt', 'DESC']],
                    raw: false,
                    nest: true,
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    handleCustomerLogin: handleCustomerLogin,
    handleCustomerRegister: handleCustomerRegister,
    getListBookingCustomer: getListBookingCustomer
}