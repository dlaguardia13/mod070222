'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_tt_ed_schedules', {
      schedules_id: {
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
      day: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      always_open: {
        type: Sequelize.CHAR,
        allowNull: false
      },
      closed: {
        type: Sequelize.CHAR,
        allowNull: false
      },
      active_user: {
        type: Sequelize.STRING
      },
      opening_time: {
        type: Sequelize.STRING
      },
      closing_time: {
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
      tableName: 'tb_tt_ed_schedules'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_tt_ed_schedules');
  }
};