const db = require("../models")

let getAllBooking = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Booking.findAll({
                where: { statusId: 'S3' },
            });

            resolve({
                errCode: 0,
                errMessage: 'Thành công',
                data
            })
        } catch (e) {
            reject(e)
        }
    })
}

let handleDeleteBooking = (bookingId) => {
    return new Promise(async (resolve, reject) => {
        let foundBookings = await db.Booking.findOne({
            where: { id: bookingId }
        })
        if (!foundBookings) {
            resolve({
                errCode: 2,
                errMessage: 'Lịch hẹn không tồn tại'
            })
        }

        await db.Booking.destroy({
            where: { id: bookingId }
        })

        resolve({
            errCode: 0,
            message: 'Lịch hẹn đã được xóa thành công'
        })
    })
}

module.exports = {
    getAllBooking: getAllBooking,
    handleDeleteBooking: handleDeleteBooking
}