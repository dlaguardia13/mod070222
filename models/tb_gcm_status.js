'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_gcm_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_gcm_status.hasMany(models.tb_bp_md_business_profile, {
        as: 'tb_bp_md_business_profile',
        foreignKey: 'tb_gcm_status_status_id'
      })

      tb_gcm_status.hasMany(models.tb_tt_to_md_tour, {
        as: 'tb_tt_to_md_tour',
        foreignKey: 'tb_gcm_status_status_id'
      })
    }
  }
  tb_gcm_status.init({
    status_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type:
    {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mg_status_id: DataTypes.STRING,
    enabled: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    removed: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    active_user: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_gcm_status',
  });
  return tb_gcm_status;
};