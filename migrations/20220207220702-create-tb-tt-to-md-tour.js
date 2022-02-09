'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_tt_to_md_tour', {
      tour_id: {
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
      tb_bp_md_business_profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tb_bp_md_business_profile',
          key: 'business_profile_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      slug: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      capacity: {
        type: Sequelize.INTEGER
      },
      product_type: {
        type: Sequelize.INTEGER
      },
      collective: {
        type: Sequelize.CHAR
      },
      available_all_year: {
        type: Sequelize.CHAR
      },
      flexible_schedules: {
        type: Sequelize.CHAR
      },
      price: {
        type: Sequelize.NUMERIC
      },
      duration_type: {
        type: Sequelize.INTEGER
      },
      time_duration: {
        type: Sequelize.INTEGER
      },
      type_of_tour: {
        type: Sequelize.INTEGER
      },
      before_booking: {
        type: Sequelize.INTEGER
      },
      min_of_people: {
        type: Sequelize.INTEGER
      },
      language_code: {
        type: Sequelize.STRING
      },
      enabled: {
        type: Sequelize.CHAR,
        //allowNull: false
      },
      removed: {
        type: Sequelize.CHAR,
        //allowNull: false
      },
      mg_tour_id: {
        type: Sequelize.STRING
      },
      active_user: {
        type: Sequelize.STRING
      },
      mg_tour_body: {
        type: Sequelize.STRING
      },
      step_validate: {
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
      tableName: 'tb_tt_to_md_tour'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_tt_to_md_tour');
  }
};