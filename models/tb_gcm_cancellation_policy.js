'use strict';
const { model } = require('mongoose');
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_gcm_cancellation_policy extends Model {
    
    static associate(models) {
      // define association here
      tb_gcm_cancellation_policy.hasMany(models.tb_tt_to_as_cp_to,{
        as: 'tb_tt_to_as_cp_to',
        foreignKey: 'tb_gcm_cancellation_policy_id'
      })
    }
  }
  
  tb_gcm_cancellation_policy.init({
    cancellation_policy_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    more_info: DataTypes.STRING,
    language_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    percent_discount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    days_before_arriving: DataTypes.INTEGER,
    hour_before_arriving: DataTypes.STRING,
    order: DataTypes.INTEGER,
    product_type: DataTypes.INTEGER,
    mg_cancellation_policy_id: DataTypes.STRING,
    active_user: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_gcm_cancellation_policy',
  });
  return tb_gcm_cancellation_policy;
};