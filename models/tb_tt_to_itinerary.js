'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_itinerary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_tt_to_itinerary.belongsTo(models.tb_tt_to_md_tour, {
        as: 'tb_tt_to_md_tour',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_itinerary.hasMany(models.tb_tt_to_activity, {
        as: 'tb_tt_to_activity',
        foreignKey: 'tb_tt_to_it_itinerary_id'
      })
    }
  }
  tb_tt_to_itinerary.init({
    itinerary_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_tt_to_md_tour_tour_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    no_day: {
      type: DataTypes.INTEGER,
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
    active_user: DataTypes.STRING,
    start_times_flexible: DataTypes.TEXT
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_tt_to_itinerary',
  });
  return tb_tt_to_itinerary;
};