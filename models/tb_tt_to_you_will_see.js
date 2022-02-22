'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_you_will_see extends Model {

    static associate(models) {
      // define association here
      tb_tt_to_you_will_see.belongsTo(models.tb_tt_to_md_tour ,{
        as: 'tb_tt_to_md_tour',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_you_will_see.hasMany(models.tb_tt_to_tr_you_will_see, {
        as: 'tb_tt_to_tr_you_will_see',
        foreignKey: 'tb_tt_to_you_will_see_you_will_see_id'
      })
    }
  }
  tb_tt_to_you_will_see.init({
    you_will_see_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_to_md_tour_tour_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    you_will_see: DataTypes.STRING,
    enabled: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    removed: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    active_user: DataTypes.STRING,
    language_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    info_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_tt_to_you_will_see',
  });
  return tb_tt_to_you_will_see;
};