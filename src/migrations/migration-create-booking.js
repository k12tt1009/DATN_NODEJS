'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('bookings', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            statusId: {
                type: Sequelize.STRING
            },
            staffId: {
                type: Sequelize.INTEGER
            },
            staffName: {
                type: Sequelize.STRING
            },
            customerId: {
                type: Sequelize.INTEGER
            },
            firstNameCustomer: {
                type: Sequelize.STRING
            },
            lastNameCustomer: {
                type: Sequelize.STRING
            },
            phoneNumber: {
                type: Sequelize.INTEGER
            },
            address: {
                type: Sequelize.STRING
            },
            licensePlates: {
                type: Sequelize.STRING
            },
            typeCar: {
                type: Sequelize.STRING
            },
            note: {
                type: Sequelize.STRING
            },
            date: {
                type: Sequelize.STRING
            },
            timeType: {
                type: Sequelize.STRING
            },
            token: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('bookings');
    }
};