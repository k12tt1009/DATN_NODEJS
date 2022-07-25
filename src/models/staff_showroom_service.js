'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class staff_showroom_service extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    staff_showroom_service.init({
        staffId: DataTypes.INTEGER,
        showroomId: DataTypes.INTEGER,
        serviceId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'staff_showroom_service',
    });
    return staff_showroom_service;
};