const db = require("../models")

let createShowroom = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.avatar || !data.address
                || !data.descriptionHTML || !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin đầu vào'
                })
            } else {

                await db.showroom.create({
                    name: data.name,
                    address: data.address,
                    image: data.avatar,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Tạo gói dịch vụ thành công'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getTopShowroom = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.showroom.findAll({
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

let getAllShowroom = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.showroom.findAll({
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

let getDetailShowroomById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin đầu vào'
                })
            } else {
                let data = await db.showroom.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown'],
                })

                if (data) {
                    let staffShowroom = [];
                    staffShowroom = await db.Staff_Infor.findAll({
                        where: { showroomId: inputId },
                        attributes: ['staffId', 'provinceId'],
                    })
                    data.staffShowroom = staffShowroom;
                } else data = {}

                resolve({
                    errCode: 0,
                    errMessage: 'Thành công',
                    data
                })

            }
        } catch (e) {
            reject(e)
        }
    })
}

let handleDeleteShowroom = (showroomsId) => {
    return new Promise(async (resolve, reject) => {
        let foundShowrooms = await db.showroom.findOne({
            where: { id: showroomsId }
        })
        if (!foundShowrooms) {
            resolve({
                errCode: 2,
                errMessage: 'Xưởng dịch vụ không tồn tại'
            })
        }

        await db.showroom.destroy({
            where: { id: showroomsId }
        })

        resolve({
            errCode: 0,
            message: 'Xưởng dịch vụ đã được xóa thành công'
        })
    })
}

let handleEditShowroom = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Thiếu tham số đầu vào'
                })
            }
            let showroom = await db.showroom.findOne({
                where: { id: data.id },
                raw: false
            })
            if (showroom) {
                showroom.name = data.name;
                showroom.address = data.address;
                showroom.descriptionHTML = data.descriptionHTML;
                showroom.descriptionMarkdown = data.descriptionMarkdown;
                if (data.avatar) {
                    showroom.image = data.avatar;
                }

                await showroom.save();

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
    createShowroom: createShowroom,
    getAllShowroom: getAllShowroom,
    getDetailShowroomById: getDetailShowroomById,
    handleDeleteShowroom: handleDeleteShowroom,
    handleEditShowroom: handleEditShowroom,
    getTopShowroom: getTopShowroom
}