'use strict';
const { model } = require('mongoose');
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_gcm_tr_cancellation_policy extends Model {
  
    static associate(models) {
      // define association here
      tb_gcm_tr_cancellation_policy.belongsTo(models.tb_gcm_cancellation_policy ,{
        as: 'tb_gcm_cancellation_policy',
        foreignKey: 'tb_gcm_cp_cancellation_policy_id'
      })
    }
  }
  tb_gcm_tr_cancellation_policy.init({
    tr_cancellation_policy_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_gcm_cp_cancellation_policy_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tr_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tr_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tr_more_info: DataTypes.STRING,
    language_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active_user: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_gcm_tr_cancellation_policy',
  });
  return tb_gcm_tr_cancellation_policy;
};