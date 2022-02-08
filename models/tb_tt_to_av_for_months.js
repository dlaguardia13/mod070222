'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_av_for_months extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_tt_to_av_for_months.belongsTo(models.tb_tt_to_md_tour, {
        as: 'tb_tt_to_md_tour',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_av_for_months.hasMany(models.tb_tt_to_days_av_per_month, {
        as: 'tb_tt_to_days_av_per_month',
        foreignKey: 'tb_tt_to_av_mo_av_months_id'
      })
    }
  }
  tb_tt_to_av_for_months.init({
    av_for_months_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_to_md_tour_tour_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    initial_month: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    final_month: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
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
    modelName: 'tb_tt_to_av_for_months',
  });
  return tb_tt_to_av_for_months;
};