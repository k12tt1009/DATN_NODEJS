import showroomService from '../services/showroomService';

let createShowroom = async (req, res) => {
    try {
        let infor = await showroomService.createShowroom(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getAllShowroom = async (req, res) => {
    try {
        let infor = await showroomService.getAllShowroom();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getTopShowroom = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await showroomService.getTopShowroom(+limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getDetailShowroomById = async (req, res) => {
    try {
        let infor = await showroomService.getDetailShowroomById(req.query.id);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let handleDeleteShowroom = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Thiếu tham số đầu vào"
        })
    }
    let message = await showroomService.handleDeleteShowroom(req.body.id);
    return res.status(200).json(message);
}

let handleEditShowroom = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Thiếu tham số đầu vào"
        })
    }
    let message = await showroomService.handleEditShowroom(req.body);
    return res.status(200).json(message);
}

module.exports = {
    createShowroom: createShowroom,
    getAllShowroom: getAllShowroom,
    getDetailShowroomById: getDetailShowroomById,
    handleDeleteShowroom: handleDeleteShowroom,
    handleEditShowroom: handleEditShowroom,
    getTopShowroom: getTopShowroom
}