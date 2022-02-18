'use strict';
const { model } = require('mongoose');
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_gcm_tr_complement extends Model {
 
    static associate(models) {
      // define association here
      tb_gcm_tr_complement.belongsTo(models.tb_gcm_complement, {
        as: 'tb_gcm_complement',
        foreignKey: 'tb_gcm_cm_complement_id'
      })
    }
  }
  tb_gcm_tr_complement.init({
    tr_complement_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_gcm_cm_complement_id: {
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
    modelName: 'tb_gcm_tr_complement',
  });
  return tb_gcm_tr_complement;
};