import newsService from '../services/newsService';

let createNews = async (req, res) => {
    try {
        let infor = await newsService.createNews(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getAllNews = async (req, res) => {
    try {
        let infor = await newsService.getAllNews();
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let getTopNews = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await newsService.getTopNews(+limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}


let getDetailNewsById = async (req, res) => {
    try {
        let infor = await newsService.getDetailNewsById(req.query.id);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Lỗi từ Server..."
        })
    }
}

let handleDeleteNews = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Thiếu tham số đầu vào"
        })
    }
    let message = await newsService.deleteNews(req.body.id);
    return res.status(200).json(message);
}

let handleEditNews = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Thiếu tham số đầu vào"
        })
    }
    let message = await newsService.EditNews(req.body);
    return res.status(200).json(message);
}

module.exports = {
    createNews: createNews,
    getAllNews: getAllNews,
    getDetailNewsById: getDetailNewsById,
    handleDeleteNews: handleDeleteNews,
    handleEditNews: handleEditNews,
    getTopNews: getTopNews
}