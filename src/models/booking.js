'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Booking.belongsTo(models.User,
                { foreignKey: 'customerId', targetKey: 'id', as: 'customerData' })

            Booking.belongsTo(models.Allcode, {
                foreignKey: 'timeType', targetKey: 'keyMap',
                as: 'timeTypeDataCustomer'
            })

            Booking.belongsTo(models.Allcode, {
                foreignKey: 'statusId', targetKey: 'keyMap',
                as: 'statusDataCustomer'
            })
        }
    };
    Booking.init({
        statusId: DataTypes.STRING,
        staffId: DataTypes.INTEGER,
        staffName: DataTypes.STRING,
        customerId: DataTypes.INTEGER,
        firstNameCustomer: DataTypes.STRING,
        lastNameCustomer: DataTypes.STRING,
        date: DataTypes.STRING,
        timeType: DataTypes.STRING,
        phoneNumber: DataTypes.INTEGER,
        address: DataTypes.STRING,
        licensePlates: DataTypes.STRING,
        typeCar: DataTypes.STRING,
        note: DataTypes.STRING,
        token: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Booking',
    });
    return Booking;
};