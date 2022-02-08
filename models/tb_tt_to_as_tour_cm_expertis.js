'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_as_tour_cm_expertis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_tt_to_as_tour_cm_expertis.belongsTo(models.tb_tt_to_md_tour ,{
        as: 'tb_tt_to_md_tour',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_as_tour_cm_expertis.belongsTo(models.tb_gcm_complement ,{
        as: 'tb_gcm_complement',
        foreignKey: 'tb_gcm_complement_complement_id'
      })
    }
  }
  tb_tt_to_as_tour_cm_expertis.init({
    cm_expertis_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_to_md_tour_tour_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tb_gcm_complement_complement_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    enabled: DataTypes.CHAR,
    removed: DataTypes.CHAR
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_tt_to_as_tour_cm_expertis',
  });
  return tb_tt_to_as_tour_cm_expertis;
};