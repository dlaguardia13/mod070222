'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_bp_md_business_profile', {
      business_profile_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      tb_gcm_status_status_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tb_gcm_status',
          key: 'status_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      web_site: {
        type: Sequelize.STRING
      },
      billing: {
        type: Sequelize.CHAR,
        allowNull: false
      },
      flexible: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mg_bussiness_profile_id: {
        type: Sequelize.STRING
      },
      active_user: {
        type: Sequelize.STRING
      },
      fundation_date: {
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.STRING
      },
      language_code: {
        type: Sequelize.STRING
      },
      average_response_time: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
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
      tableName: 'tb_bp_md_business_profile'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_bp_md_business_profile');
  }
};