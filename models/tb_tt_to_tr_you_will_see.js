'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_tr_you_will_see extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_tt_to_tr_you_will_see.belongsTo(models.tb_tt_to_you_will_see, {
        as: 'tb_tt_to_you_will_see',
        foreignKey: 'tb_tt_to_you_will_see_you_will_see_id'
      })
    }
  }
  tb_tt_to_tr_you_will_see.init({
    tr_you_will_see_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_to_you_will_see_you_will_see_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    language_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    translation: {
      type: DataTypes.TEXT,
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
    modelName: 'tb_tt_to_tr_you_will_see',
  });
  return tb_tt_to_tr_you_will_see;
};