'use strict';
const { model } = require('mongoose');
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_gcm_tr_included_in_price extends Model {
  
    static associate(models) {
      // define association here
      tb_gcm_tr_included_in_price.belongsTo(models.tb_gcm_included_in_price,{
        as: 'tb_gcm_included_in_price',
        foreignKey: 'tb_gcm_ip_included_in_price_id'
      })
    }
  }
  tb_gcm_tr_included_in_price.init({
    tr_included_in_price_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_gcm_ip_included_in_price_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    translation: {
      type: DataTypes.STRING,
      allowNull: false
    },
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
    modelName: 'tb_gcm_tr_included_in_price',
  });
  return tb_gcm_tr_included_in_price;
};