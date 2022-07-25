require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '" Car Maintenance" <trandinhkhanh01091998@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Xác nhận thông tin đặt lịch bảo dưỡng ✔", // Subject line
        html: `
        <h3>Xin chào ${dataSend.customerName}!</h3>
        <p>Bạn đã đặt lịch bảo dưỡng xe tại Car Maintenance</p>
        <p>Thông tin đặt lịch bảo dưỡng:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Chuyên viên: ${dataSend.staffName}</b></div>

        <p>Vui lòng click vào đường link bên dưới để xác nhận lịch bảo dưỡng của bạn!</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Nhấp vào đây để xác nhận</a>
        </div>

        <div>Xin cảm ơn quý khách đã sử dụng dịch vụ!</div>
        `, // html body
    });
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: 'Car Maintenance" <trandinhkhanh01091998@gmail.com>',
                to: dataSend.email,
                subject: 'Hóa đơn dịch vụ tại Car Maintenance',
                html: `
                    <h3>Xin chào ${dataSend.customerName}!</h3>
                    <p>Cảm ơn quý khách đã sử dụng dịch vụ của Car Maintenance</p>
                    <p>Thông tin hóa đơn dịch vụ được gửi trong file đính kèm</p>

                    <div>Rất hân hạnh được phục vụ quý khách. Chúc quý khách thượng lộ bình an!</div>
                `,
                attachments: [
                    {
                        filename: `remedy-${dataSend.customerId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    },
                ]
            });
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    sendSimpleEmail,
    sendAttachment
}