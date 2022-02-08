'use strict';
const { model } = require('mongoose');
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_as_tour_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_tt_to_as_tour_category.belongsTo(models.tb_tt_to_md_tour, {
        as: 'tb_tt_to_md_tour',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_as_tour_category.belongsTo(models.tb_gcm_category, {
        as: 'tb_gcm_category',
        foreignKey: 'tb_gcm_category_category_id'
      })
    }
  }
  tb_tt_to_as_tour_category.init({
    as_tour_category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_to_md_tour_tour_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tb_gcm_category_category_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    enabled: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    removed: {
      type: DataTypes.CHAR,
      allowNull: false
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_tt_to_as_tour_category',
  });
  return tb_tt_to_as_tour_category;
};