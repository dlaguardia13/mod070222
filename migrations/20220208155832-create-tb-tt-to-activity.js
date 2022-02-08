'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_tt_to_activity', {
      activity_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      tb_tt_to_it_itinerary_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tb_tt_to_itinerary',
          key: 'itinerary_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      language_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      start_time: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mg_activity_id: {
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
      tableName: 'tb_tt_to_activity'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_tt_to_activity');
  }
};