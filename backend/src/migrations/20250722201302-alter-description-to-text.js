"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("products", "description", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("products", "description", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
