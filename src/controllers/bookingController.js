import bookingService from '../services/bookingService';

let getAllBooking = async (req, res) => {
    try {
        let infor = await bookingService.getAllBooking();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let handleDeleteBooking = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Thiếu tham số đầu vào"
        })
    }
    let message = await bookingService.handleDeleteBooking(req.body.id);
    return res.status(200).json(message);
}

module.exports = {
    getAllBooking: getAllBooking,
    handleDeleteBooking: handleDeleteBooking
}