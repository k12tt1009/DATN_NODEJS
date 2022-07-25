const Sequelize = require("sequelize")
const Op = Sequelize.Op
const db = require("../models")

let getSearchByKeyword = (keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!keyword) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu thông tin đầu vào'
                })
            } else {
                let data1 = await db.Services.findAll({
                    where: {
                        [Op.or]: [
                            {
                                name: {
                                    [Op.like]: `%${keyword}%`
                                },
                            },
                            {
                                tags: {
                                    [Op.like]: `%${keyword}%`
                                }
                            }
                        ],
                    },
                    attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown', 'image'],
                })

                let data2 = await db.showroom.findAll({
                    where: {
                        [Op.or]: [
                            {
                                name: {
                                    [Op.like]: `%${keyword}%`
                                },
                            },
                        ],
                    },
                    attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown', 'image'],
                })

                if (data1 && data1.length > 0) {
                    data1.map(item => {
                        item.image = new Buffer(item.image, 'base64').toString('binary');
                        return item;
                    })
                }

                if (data2 && data2.length > 0) {
                    data2.map(item => {
                        item.image = new Buffer(item.image, 'base64').toString('binary');
                        return item;
                    })
                }

                data1 = data1.map((item) => {
                    item.type = "service";
                    return item;
                });

                data2 = data2.map((item) => {
                    item.type = "showroom";
                    return item;
                });

                const data = [...data1, ...data2].sort((a, b) => a - b)

                if (!data) data = {};


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

module.exports = {
    getSearchByKeyword: getSearchByKeyword
}