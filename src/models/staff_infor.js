'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Staff_Infor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Staff_Infor.belongsTo(models.User, { foreignKey: 'staffId' })

            Staff_Infor.belongsTo(models.Allcode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceTypeData' })
            Staff_Infor.belongsTo(models.Allcode, { foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceTypeData' })
            Staff_Infor.belongsTo(models.Allcode, { foreignKey: 'serviceId', targetKey: 'keyMap', as: 'serviceTypeData' })
        }
    };
    Staff_Infor.init({
        staffId: DataTypes.INTEGER,
        serviceId: DataTypes.INTEGER,
        showroomId: DataTypes.INTEGER,
        priceId: DataTypes.STRING,
        provinceId: DataTypes.STRING,
        addressShowroom: DataTypes.STRING,
        nameShowroom: DataTypes.STRING,
        note: DataTypes.STRING,
        count: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Staff_Infor',
        freezeTableName: true
    });
    return Staff_Infor;
};