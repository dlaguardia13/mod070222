'use strict';
const { model } = require('mongoose');
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_gcm_state extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_gcm_state.belongsTo(models.tb_gcm_country, {
        as: 'tb_gcm_country',
        foreignKey: 'tb_gcm_country_country_id'
      })

      tb_gcm_state.hasMany(models.tb_gcm_city, {
        as: 'tb_gcm_city',
        foreignKey: 'tb_gcm_state_state_id'
      })

      tb_gcm_state.hasMany(models.tb_tt_to_address_tour, {
        as: 'tb_gcm_state',
        foreignKey: 'tb_gcm_state_state_id'
      })
    }
  }
  tb_gcm_state.init({
    state_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4
    },
    tb_gcm_country_country_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mg_state_id: DataTypes.STRING,
    enabled: {
      type: DataTypes.CHAR,
      allowNull: false
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
    modelName: 'tb_gcm_state',
  });
  return tb_gcm_state;
};