'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_bp_md_business_profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_bp_md_business_profile.belongsTo(models.tb_gcm_status, {
        as: 'tb_gcm_status',
        foreignKey: 'tb_gcm_status_status_id'
      })

      tb_bp_md_business_profile.hasMany(models.tb_tt_to_md_tour, {
        as: 'tb_tt_to_md_tour',
        foreignKey: 'tb_bp_md_business_profile_id'
      })
    }
  }
  tb_bp_md_business_profile.init({
    business_profile_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_gcm_status_status_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    web_site: DataTypes.STRING,
    billing: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    flexible: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mg_bussiness_profile_id: DataTypes.STRING,
    active_user: DataTypes.STRING,
    fundation_date: DataTypes.DATE,
    description: DataTypes.STRING,
    language_code: DataTypes.STRING,
    average_response_time: DataTypes.DATE
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_bp_md_business_profile',
  });
  return tb_bp_md_business_profile;
};