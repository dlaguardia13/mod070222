'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_price_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_tt_to_price_type.belongsTo(models.tb_tt_to_md_tour, {
        as: 'tb_tt_to_md_tour',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })
    }
  }
  tb_tt_to_price_type.init({
    to_price_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_to_md_tour_tour_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    price_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    min_per: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    child: DataTypes.INTEGER,
    adult: DataTypes.INTEGER,
    active_user: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_tt_to_price_type',
  });
  return tb_tt_to_price_type;
};