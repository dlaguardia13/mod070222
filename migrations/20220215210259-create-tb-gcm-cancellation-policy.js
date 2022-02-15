'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_gcm_cancellation_policy', {
      cancellation_policy_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      more_info: {
        type: Sequelize.STRING
      },
      language_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      percent_discount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      days_before_arriving: {
        type: Sequelize.INTEGER
      },
      hour_before_arriving: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.INTEGER
      },
      product_type: {
        type: Sequelize.INTEGER
      },
      mg_cancellation_policy_id: {
        type: Sequelize.STRING
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
      tableName: 'tb_gcm_cancellation_policy'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_gcm_cancellation_policy');
  }
};