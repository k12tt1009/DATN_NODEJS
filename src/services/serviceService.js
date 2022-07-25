const db = require("../models")


let createService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.avatar || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin đầu vào'
                })
            } else {

                await db.Services.create({
                    name: data.name,
                    image: data.avatar,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    tags: data.tags
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

let getAllService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Services.findAll({
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

let getTopService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Services.findAll({
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

let getDetailServiceById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin đầu vào'
                })
            } else {
                let data = await db.Services.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                })

                if (data) {
                    let staffService = [];
                    if (location === 'ALL') {
                        staffService = await db.Staff_Infor.findAll({
                            where: { serviceId: inputId },
                            attributes: ['staffId', 'provinceId'],
                        })
                    } else {
                        //find by location
                        staffService = await db.Staff_Infor.findAll({
                            where: {
                                serviceId: inputId,
                                provinceId: location
                            },
                            attributes: ['staffId', 'provinceId'],
                        })
                    }
                    data.staffService = staffService;
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

let deleteServices = (servicesId) => {
    return new Promise(async (resolve, reject) => {
        let foundServices = await db.Services.findOne({
            where: { id: servicesId }
        })
        if (!foundServices) {
            resolve({
                errCode: 2,
                errMessage: 'Gói dịch vụ không tồn tại'
            })
        }

        await db.Services.destroy({
            where: { id: servicesId }
        })

        resolve({
            errCode: 0,
            message: 'Gói dịch vụ đã được xóa thành công'
        })
    })
}

let handleEditService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Thiếu tham số đầu vào'
                })
            }
            let service = await db.Services.findOne({
                where: { id: data.id },
                raw: false
            })
            if (service) {
                service.name = data.name;
                service.descriptionHTML = data.descriptionHTML;
                service.descriptionMarkdown = data.descriptionMarkdown;
                service.tags = data.tags;
                if (data.avatar) {
                    service.image = data.avatar;
                }

                await service.save();

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
    createService: createService,
    getAllService: getAllService,
    getDetailServiceById: getDetailServiceById,
    deleteServices: deleteServices,
    handleEditService: handleEditService,
    getTopService: getTopService
}