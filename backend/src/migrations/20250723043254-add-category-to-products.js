"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("products", "category", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Outros",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("products", "category");
  },
};
