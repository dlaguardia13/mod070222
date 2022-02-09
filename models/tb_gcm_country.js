'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_gcm_country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_gcm_country.hasMany(models.tb_gcm_state, {
        as: 'tb_gcm_state',
        foreignKey: 'tb_gcm_country_country_id'
      })

      tb_gcm_country.hasMany(models.tb_tt_to_address_tour, {
        as: 'tb_tt_to_address_tour',
        foreignKey: 'tb_gcm_country_country_id'
      })
    }
  }
  tb_gcm_country.init({
    country_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_enabled: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    mg_country_id: DataTypes.STRING,
    document_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    regular_expression: DataTypes.STRING,
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
    modelName: 'tb_gcm_country',
  });
  return tb_gcm_country;
};