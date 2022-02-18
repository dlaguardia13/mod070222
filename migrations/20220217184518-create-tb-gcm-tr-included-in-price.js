'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_gcm_tr_included_in_price', {
      tr_included_in_price_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      tb_gcm_ip_included_in_price_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tb_gcm_included_in_price',
          key: 'included_in_price_id'
        }
      },
      translation: {
        type: Sequelize.STRING,
        allowNull: false
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
      tableName: 'tb_gcm_tr_included_in_price'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_gcm_tr_included_in_price');
  }
};