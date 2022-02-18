'use strict';

const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_gcm_complement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_gcm_complement.hasMany(models.tb_tt_to_as_tour_cm_expertis, {
        as: 'tb_tt_to_as_tour_cm_expertis',
        foreignKey: 'tb_gcm_complement_complement_id'
      })

      tb_gcm_complement.hasMany(models.tb_tt_to_as_tour_cm_whant, {
        as: 'tb_tt_to_as_tour_cm_whant',
        foreignKey: 'tb_gcm_complement_complement_id'
      })

      tb_gcm_complement.hasMany(models.tb_tt_to_as_tour_cm_difficult, {
        as: 'tb_tt_to_as_tour_cm_difficult',
        foreignKey: 'tb_gcm_cm_complement_id'
      })

      tb_gcm_complement.hasMany(models.tb_tt_to_as_tour_cm_suit_to, {
        as: 'tb_tt_to_as_tour_cm_suit_to',
        foreignKey: 'tb_gcm_cm_complement_id'
      })

      tb_gcm_complement.hasMany(models.tb_tt_to_as_tour_cm_general, {
        as: 'tb_tt_to_as_tour_cm_general',
        foreignKey: 'tb_gcm_cm_complement_id'
      })

      tb_gcm_complement.hasMany(models.tb_tt_to_as_tour_cm_sc, {
        as: 'tb_tt_to_as_tour_cm_sc',
        foreignKey: 'tb_gcm_cm_complement_id'
      })

      tb_gcm_complement.hasMany(models.tb_tt_to_as_tour_cm_sn, {
        as: 'tb_tt_to_as_tour_cm_sn',
        foreignKey: 'tb_gcm_cm_complement_id'
      })

      tb_gcm_complement.hasMany(models.tb_tt_to_as_tour_complement, {
        as: 'tb_tt_to_as_tour_complement',
        foreignKey: 'tb_gcm_complement_complement_id'
      })

      tb_gcm_complement.hasOne(models.tb_gcm_tr_complement,{
        as: 'tb_gcm_tr_complement',
        foreignKey: 'tb_gcm_cm_complement_id'
      })

    }
  }
  tb_gcm_complement.init({
    complement_id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    language_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    complement_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mg_complement_id: DataTypes.STRING,
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
    modelName: 'tb_gcm_complement',
  });
  return tb_gcm_complement;
};