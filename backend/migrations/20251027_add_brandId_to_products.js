const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'brandId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Brands',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
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
