import serviceService from '../services/serviceService';

let createService = async (req, res) => {
    try {
        let infor = await serviceService.createService(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getAllService = async (req, res) => {
    try {
        let infor = await serviceService.getAllService();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getTopService = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let infor = await serviceService.getTopService();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getDetailServiceById = async (req, res) => {
    try {
        let infor = await serviceService.getDetailServiceById(req.query.id, req.query.location);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let handleDeleteService = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Thiếu tham số đầu vào"
        })
    }
    let message = await serviceService.deleteServices(req.body.id);
    return res.status(200).json(message);
}

let handleEditService = async (req, res) => {
    let data = req.body;
    let message = await serviceService.handleEditService(data);
    return res.status(200).json(message)
}

module.exports = {
    createService: createService,
    getAllService: getAllService,
    getDetailServiceById: getDetailServiceById,
    handleDeleteService: handleDeleteService,
    handleEditService: handleEditService,
    getTopService: getTopService
}