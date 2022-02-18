'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_gcm_included_in_price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_gcm_included_in_price.hasMany(models.tb_tt_to_as_tour_ip, {
        as: 'tb_tt_to_as_tour_ip',
        foreignKey: 'tb_gcm_p_included_in_price_id'
      })

      tb_gcm_included_in_price.hasMany(models.tb_gcm_tr_included_in_price,{
        as: 'tb_gcm_tr_included_in_price',
        foreignKey: 'tb_gcm_ip_included_in_price_id'
      })
    }
  }
  tb_gcm_included_in_price.init({
    included_in_price_id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: UUIDV4
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    language_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mg_included_in_price_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    enabled: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    removed: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    active_user: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_gcm_included_in_price',
  });
  return tb_gcm_included_in_price;
};