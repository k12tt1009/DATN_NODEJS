import staffService from "../services/staffService";

let getTopStaffHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await staffService.getTopStaffHome(+limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getAllStaffs = async (req, res) => {
    try {
        let staffs = await staffService.getAllStaffs();
        return res.status(200).json(staffs)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let postInforStaffs = async (req, res) => {
    try {
        let response = await staffService.saveDetailInforStaff(req.body)
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getDetailStaffById = async (req, res) => {
    try {
        let infor = await staffService.getDetailStaffById(req.query.id);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await staffService.bulkCreateSchedule(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let infor = await staffService.getScheduleByDate(req.query.staffId, req.query.date);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getExtraInforStaffById = async (req, res) => {
    try {
        let infor = await staffService.getExtraInforStaffById(req.query.staffId);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getProfileStaffById = async (req, res) => {
    try {
        let infor = await staffService.getProfileStaffById(req.query.staffId);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getListCustomerForStaff = async (req, res) => {
    try {
        let infor = await staffService.getListCustomerForStaff(req.query.staffId, req.query.date);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let sendRemedy = async (req, res) => {
    try {
        let infor = await staffService.sendRemedy(req.body);
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
    getTopStaffHome: getTopStaffHome,
    getAllStaffs: getAllStaffs,
    postInforStaffs: postInforStaffs,
    getDetailStaffById: getDetailStaffById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforStaffById: getExtraInforStaffById,
    getProfileStaffById: getProfileStaffById,
    getListCustomerForStaff: getListCustomerForStaff,
    sendRemedy: sendRemedy
}