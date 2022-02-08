'use strict';
const {
  Model, UUID, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_ed_schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_tt_ed_schedules.belongsTo(models.tb_tt_to_md_tour ,{
        as: 'tb_tt_to_md_tour',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })
    }
  }
  tb_tt_ed_schedules.init({
    schedules_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_to_md_tour_tour_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    always_open: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    closed: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    active_user: DataTypes.STRING,
    opening_time: DataTypes.STRING,
    closing_time: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_tt_ed_schedules',
  });
  return tb_tt_ed_schedules;
};