const db = require("../models")


let createNews = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.description
                || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin đầu vào'
                })
            } else {

                await db.News.create({
                    name: data.name,
                    image: data.avatar,
                    description: data.description,
                    contentMarkdown: data.contentMarkdown,
                    contentHTML: data.contentHTML
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Tạo bài viết thành công'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllNews = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.News.findAll({
                order: [['createdAt']],
            });

            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
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

let getTopNews = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.News.findAll({
                limit: limitInput,
                order: [['createdAt', 'DESC']],
            });

            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
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

let getDetailNewsById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin đầu vào'
                })
            } else {
                let data = await db.News.findOne({
                    where: {
                        id: inputId
                    },

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

let deleteNews = (newsId) => {
    return new Promise(async (resolve, reject) => {
        let foundNews = await db.News.findOne({
            where: { id: newsId }
        })
        if (!foundNews) {
            resolve({
                errCode: 2,
                errMessage: 'Bài viết không tồn tại'
            })
        }

        await db.News.destroy({
            where: { id: newsId }
        })

        resolve({
            errCode: 0,
            message: 'Bài viết đã được xóa thành công'
        })
    })
}

let EditNews = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Thiếu tham số đầu vào'
                })
            }
            let news = await db.News.findOne({
                where: { id: data.id },
                raw: false
            })
            if (news) {
                news.name = data.name;
                news.description = data.description;
                news.contentHTML = data.contentHTML;
                news.contentMarkdown = data.contentMarkdown;
                if (data.avatar) {
                    news.image = data.avatar;
                }

                await news.save();

                resolve({
                    errCode: 0,
                    message: 'Cập nhật bài viết thành công'
                })

            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy bài viết'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createNews: createNews,
    getAllNews: getAllNews,
    getDetailNewsById: getDetailNewsById,
    deleteNews: deleteNews,
    EditNews: EditNews,
    getTopNews: getTopNews
}