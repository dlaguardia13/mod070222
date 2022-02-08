'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_gcm_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_gcm_category.hasMany(models.tb_tt_to_as_tour_category, {
        as: 'tb_tt_to_as_tour_category',
        foreignKey: 'tb_gcm_category_category_id'
      })
    }
  }
  tb_gcm_category.init({
    category_id:
    {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    language_code:
    {
      type: DataTypes.STRING,
      allowNull: false
    },
    mg_category_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    enabled: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    removed: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    active_user: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
    modelName: 'tb_gcm_category',
  });
  return tb_gcm_category;
};