'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_tr_custom_term extends Model {

    static associate(models) {
      // define association here
      tb_tt_to_tr_custom_term.belongsTo(models.tb_tt_to_custom_term,{
        as: 'tb_tt_to_custom_term',
        foreignKey: 'tb_tt_ct_custom_term_id'
      })
    }
  }
  tb_tt_to_tr_custom_term.init({
    tr_custom_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_ct_custom_term_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    language_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    translation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active_user: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_tt_to_tr_custom_term',
  });
  return tb_tt_to_tr_custom_term;
};