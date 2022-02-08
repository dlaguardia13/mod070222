'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_tt_to_itinerary', {
      itinerary_id: {
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
      no_day: {
        type: Sequelize.INTEGER,
        allowNull: false
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
      start_times_flexible: {
        type: Sequelize.TEXT
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
      tableName: 'tb_tt_to_itinerary'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_tt_to_itinerary');
  }
};