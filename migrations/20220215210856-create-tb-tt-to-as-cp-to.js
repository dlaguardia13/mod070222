'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_tt_to_as_cp_to', {
      as_cancellation_tour_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      tb_tt_to_md_tour_tour_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tb_tt_to_md_tour',
          key: 'tour_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tb_gcm_cancellation_policy_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tb_gcm_cancellation_policy',
          key: 'cancellation_policy_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      custom_no_days: {
        type: Sequelize.INTEGER
      },
      custom_percent: {
        type: Sequelize.INTEGER
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
      tableName: 'tb_tt_to_as_cp_to'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_tt_to_as_cp_to');
  }
};