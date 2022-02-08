'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_tt_to_price_type', {
      to_price_id: {
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
      price_type: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      min_per: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      child: {
        type: Sequelize.INTEGER
      },
      adult: {
        type: Sequelize.INTEGER
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
      tableName: 'tb_tt_to_price_type'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_tt_to_price_type');
  }
};