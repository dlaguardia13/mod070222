'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_gcm_category', {
      category_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      language_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mg_category_id: {
        type: Sequelize.STRING
      },
      enabled: {
        type: Sequelize.CHAR,
        allowNull: false
      },
      removed: {
        type: Sequelize.CHAR,
        allowNull: false
      },
      active_user: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.DATE
      }
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      tableName: 'tb_gcm_category'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_gcm_category');
  }
};