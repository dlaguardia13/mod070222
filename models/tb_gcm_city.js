'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_gcm_city extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_gcm_city.belongsTo(models.tb_gcm_state, {
        as: 'tb_gcm_state',
        foreignKey: 'tb_gcm_state_state_id'
      })

      tb_gcm_city.hasMany(models.tb_tt_to_address_tour, {
        as: 'tb_gcm_city',
        foreignKey: 'tb_gcm_city_city_id'
      })
    }
  }
  tb_gcm_city.init({
    city_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_gcm_state_state_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mg_city_id: DataTypes.STRING,
    enabled: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    removed: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    active_user: DataTypes.STRING,
    postal_code: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_gcm_city',
  });
  return tb_gcm_city;
};