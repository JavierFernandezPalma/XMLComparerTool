'use strict';

const { LOG_ERROR_TABLE, LogErrorSchema } = require('./../models/logErrorModel');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(LOG_ERROR_TABLE, LogErrorSchema);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(LOG_ERROR_TABLE);
  }
};