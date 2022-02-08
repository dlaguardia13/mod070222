'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_tr_activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_tt_to_tr_activity.belongsTo(models.tb_tt_to_activity, {
        as: 'tb_tt_to_activity',
        foreignKey: 'tb_tt_to_activity_activity_id'
      })
    }
  }
  tb_tt_to_tr_activity.init({
    tr_activity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_to_activity_activity_id: {
      type: DataTypes.UUID,
      allowNull: false
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
    modelName: 'tb_tt_to_tr_activity',
  });
  return tb_tt_to_tr_activity;
};