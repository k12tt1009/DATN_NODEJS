import customerService from '../services/customerService';
import { reject } from "bcrypt/promises";

let postBookAppointment = async (req, res) => {
    try {
        let infor = await customerService.postBookAppointment(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let infor = await customerService.postVerifyBookAppointment(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let handleCustomerLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Email và password không được trống'
        })
    }

    let customerData = await customerService.handleCustomerLogin(email, password);
    // check email exist
    // compare password
    // return userInfor
    // access_token:JWT (json web token)
    return res.status(200).json({
        errCode: customerData.errCode,
        message: customerData.errMessage,
        customer: customerData.customer ? customerData.customer : {}
    })
}

let handleCustomerRegister = async (req, res) => {
    let message = await customerService.handleCustomerRegister(req.body);
    return res.status(200).json(message);
}

let getListBookingCustomer = async (req, res) => {
    try {
        let infor = await customerService.getListBookingCustomer(req.query.id);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    handleCustomerLogin: handleCustomerLogin,
    handleCustomerRegister: handleCustomerRegister,
    getListBookingCustomer: getListBookingCustomer
}