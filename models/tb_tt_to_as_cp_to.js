'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_as_cp_to extends Model {
    
    static associate(models) {
      // define association here
      tb_tt_to_as_cp_to.belongsTo(models.tb_tt_to_md_tour,{
        as: 'tb_tt_to_md_tour',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_as_cp_to.belongsTo(models.tb_gcm_cancellation_policy,{
        as: 'tb_gcm_cancellation_policy',
        foreignKey: 'tb_gcm_cancellation_policy_id'
      })

    }
  }
  tb_tt_to_as_cp_to.init({
    as_cancellation_tour_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_to_md_tour_tour_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tb_gcm_cancellation_policy_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    custom_no_days: DataTypes.INTEGER,
    custom_percent: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_tt_to_as_cp_to',
  });
  return tb_tt_to_as_cp_to;
};