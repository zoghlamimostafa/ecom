const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'brand');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'brand', {
      type: DataTypes.STRING,
      allowNull: true
    });
    await queryInterface.removeColumn('Products', 'brandId');
  }
};
