'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_tt_to_tr_you_will_see', {
      tr_you_will_see_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      tb_tt_to_you_will_see_you_will_see_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tb_tt_to_you_will_see',
          key: 'you_will_see_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      language_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      translation: {
        type: Sequelize.TEXT,
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
      tableName: 'tb_tt_to_tr_you_will_see'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_tt_to_tr_you_will_see');
  }
};