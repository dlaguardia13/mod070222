'use strict';
const {
  Model, UUIDV4, ForeignKeyConstraintError
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_gcm_language extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_gcm_language.hasMany(models.tb_tt_to_as_tour_language, {
        as: 'tb_tt_to_as_tour_language',
        foreignKey: 'tb_gcm_language_language_id'
      })
    }
  }
  tb_gcm_language.init({
    language_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mg_language_id: DataTypes.STRING,
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
      allowNull: false
    },
    language_code: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_gcm_language',
  });
  return tb_gcm_language;
};