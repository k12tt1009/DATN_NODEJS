'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('histories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            staffId: {
                type: Sequelize.INTEGER
            },
            customerId: {
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.TEXT
            },
            files: {
                type: Sequelize.TEXT
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
        await queryInterface.dropTable('histories');
    }
};