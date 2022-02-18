'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_gcm_tr_cancellation_policy', {
      tr_cancellation_policy_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      tb_gcm_cp_cancellation_policy_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tb_gcm_cancellation_policy',
          key: 'cancellation_policy_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tr_title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tr_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tr_more_info: {
        type: Sequelize.STRING
      },
      language_code: {
        type: Sequelize.STRING,
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
      tableName: 'tb_gcm_tr_cancellation_policy'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_gcm_tr_cancellation_policy');
  }
};