'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_days_av_per_month extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_tt_to_days_av_per_month.belongsTo(models.tb_tt_to_av_for_months, {
        as: 'tb_tt_to_av_for_months',
        foreignKey: 'tb_tt_to_av_mo_av_months_id'
      })
    }
  }
  tb_tt_to_days_av_per_month.init({
    days_av_per_month_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_to_av_mo_av_months_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    active_user: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_tt_to_days_av_per_month',
  });
  return tb_tt_to_days_av_per_month;
};