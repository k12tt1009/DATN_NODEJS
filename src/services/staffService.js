import db from "../models/index";
require('dotenv').config();
import _, { reject } from 'lodash';
import emailService from '../services/emailService';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopStaffHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllStaffs = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let staffs = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })

            resolve({
                errCode: 0,
                data: staffs
            })
        } catch (e) {
            reject(e)
        }
    })
}

let saveDetailInforStaff = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.staffId || !inputData.contentHTML
                || !inputData.contentMarkdown || !inputData.action
                || !inputData.selectedService || !inputData.selectedProvince || !inputData.selectedPrice
                || !inputData.nameShowroom || !inputData.addressShowroom
                || !inputData.note || !inputData.serviceId
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số đầu vào'
                })
            } else {

                //upsert to Markdown table
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        staffId: inputData.staffId
                    })
                } else if (inputData.action === 'EDIT') {
                    let staffMarkdown = await db.Markdown.findOne({
                        where: { staffId: inputData.staffId },
                        raw: false
                    })

                    if (staffMarkdown) {
                        staffMarkdown.contentHTML = inputData.contentHTML;
                        staffMarkdown.contentMarkdown = inputData.contentMarkdown;
                        staffMarkdown.description = inputData.description;
                        staffMarkdown.updatedAt = new Date();
                        await staffMarkdown.save();
                    }

                }

                //upsert to Staff_infor table
                let staffInfor = await db.Staff_Infor.findOne({
                    where: {
                        staffId: inputData.staffId,
                    },
                    raw: false
                })

                if (staffInfor) {
                    //update
                    staffInfor.staffId = inputData.staffId;
                    staffInfor.priceId = inputData.selectedPrice;
                    staffInfor.provinceId = inputData.selectedProvince;
                    staffInfor.serviceId = inputData.selectedService;
                    staffInfor.addressShowroom = inputData.addressShowroom;
                    staffInfor.nameShowroom = inputData.nameShowroom;
                    staffInfor.note = inputData.note;
                    staffInfor.serviceId = inputData.serviceId;
                    staffInfor.showroomId = inputData.showroomId;
                    await staffInfor.save();
                } else {
                    //create
                    await db.Staff_Infor.create({
                        staffId: inputData.staffId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        serviceId: inputData.selectedService,
                        addressShowroom: inputData.addressShowroom,
                        nameShowroom: inputData.nameShowroom,
                        note: inputData.note,
                        serviceId: inputData.serviceId,
                        showroomId: inputData.showroomId
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Lưu thông tin chuyên viên thành công'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getDetailStaffById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin đầu vào'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Staff_Infor,
                            attributes: {
                                exclude: ['id', 'staffId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'serviceTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

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

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.arrSchedule || !data.staffId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin đầu vào'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let existing = await db.Schedule.findAll(
                    {
                        where: { staffId: data.staffId, date: data.formatedDate },
                        attributes: ['timeType', 'date', 'staffId', 'maxNumber'],
                        raw: true
                    }
                );

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Thành công'
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDate = (staffId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!staffId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số đầu vào'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        staffId: staffId,
                        date: date
                    },

                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'staffData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true

                })
                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getExtraInforStaffById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số đầu vào'
                })
            } else {
                let data = await db.Staff_Infor.findOne({
                    where: {
                        staffId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'staffId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'serviceTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getProfileStaffById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số đầu vào'
                })
            } else {

                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Staff_Infor,
                            attributes: {
                                exclude: ['id', 'staffId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'serviceTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })

            }
        } catch (e) {
            reject(e)
        }
    })
}

let getListCustomerForStaff = (staffId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!staffId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số đầu vào'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        staffId: staffId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'customerData',
                            attributes: ['email', 'firstName', 'lastName', 'phoneNumber', 'address'],
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataCustomer', attributes: ['valueVi', 'valueEn']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {

        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.staffId || !data.customerId || !data.timeType || !data.imgBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số đầu vào!'
                })
            } else {
                // update customer status
                let appointment = await db.Booking.findOne({
                    where: {
                        staffId: data.staffId,
                        customerId: data.customerId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save()
                }

                //send email remedy
                await emailService.sendAttachment(data);
                resolve({
                    errCode: 0,
                    errMessage: 'Thành công'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopStaffHome: getTopStaffHome,
    getAllStaffs: getAllStaffs,
    saveDetailInforStaff: saveDetailInforStaff,
    getDetailStaffById: getDetailStaffById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforStaffById: getExtraInforStaffById,
    getProfileStaffById: getProfileStaffById,
    getListCustomerForStaff: getListCustomerForStaff,
    sendRemedy: sendRemedy
}