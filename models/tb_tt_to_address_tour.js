'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_address_tour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_tt_to_address_tour.belongsTo(models.tb_tt_to_md_tour, {
        as: 'tb_tt_to_md_tour',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_address_tour.belongsTo(models.tb_gcm_country, {
        as: 'tb_gcm_country',
        foreignKey: 'tb_gcm_country_country_id'
      })

      tb_tt_to_address_tour.belongsTo(models.tb_gcm_state, {
        as: 'tb_gcm_state',
        foreignKey: 'tb_gcm_state_state_id'
      })
    }
  }
  tb_tt_to_address_tour.init({
    to_address_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_to_md_tour_tour_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tb_gcm_country_country_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tb_gcm_state_state_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tb_gcm_city_city_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    real_address: DataTypes.STRING,
    latitude: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    length: {
      type: DataTypes.NUMERIC,
      allowNull: false
    },
    active_user: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_tt_to_address_tour',
  });
  return tb_tt_to_address_tour;
};