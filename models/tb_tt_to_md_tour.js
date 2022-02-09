'use strict';
//import SequelizeSlugify from 'sequelize-slugify';

const {
  Model, UUIDV4
} = require('sequelize');

const  SequelizeSlugify = require('sequelize-slugify')

module.exports = (sequelize, DataTypes) => {
  class tb_tt_to_md_tour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_tt_to_md_tour.belongsTo(models.tb_gcm_status, {
        as: 'tb_gcm_status',
        foreignKey: 'tb_gcm_status_status_id'
      })

      tb_tt_to_md_tour.belongsTo(models.tb_bp_md_business_profile, {
        as: 'tb_bp_md_business_profile',
        foreignKey: 'tb_bp_md_business_profile_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_as_tour_category, {
        as: 'tb_tt_to_as_tour_category',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_address_tour, {
        as: 'tb_tt_to_address',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_gallery, {
        as: 'tb_tt_to_gallery',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_tr_tour, {
        as: 'tb_tt_to_tr_tour',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_as_tour_language, {
        as: 'tb_tt_to_as_tour_language',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })
      
      tb_tt_to_md_tour.hasMany(models.tb_tt_to_as_tour_ip, {
        as: 'tb_tt_to_as_tour_ip',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_group_discount, {
        as: 'tb_tt_to_group_descount',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })
      
      tb_tt_to_md_tour.hasMany(models.tb_tt_to_itinerary, {
        as: 'models.tb_tt_to_itinerary',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_price_type, {
        as: 'tb_tt_to_price_type',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_days_av_per_year, {
        as: 'tb_tt_to_days_av_per_year',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_av_for_months, {
        as: 'tb_tt_to_av_for_months',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_as_tour_cm_expertis, {
        as: 'tb_tt_to_as_tour_cm_expertis',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_as_tour_cm_whant, {
        as: 'tb_tt_to_as_tour_cm_whant',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_as_tour_cm_difficult, {
        as: 'tb_tt_to_as_tour_cm_difficult',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_as_tour_cm_suit_to, {
        as: 'tb_tt_to_as_tour_cm_suit_to',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })

      tb_tt_to_md_tour.hasMany(models.tb_tt_to_you_will_see, {
        as: 'tb_tt_to_you_will_see',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })
      
      tb_tt_to_md_tour.hasMany(models.tb_tt_ed_schedules, {
        as: 'tb_tt_ed_schedules',
        foreignKey: 'tb_tt_to_md_tour_tour_id'
      })
    }
  }
  tb_tt_to_md_tour.init({
    tour_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    tb_gcm_status_status_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tb_bp_md_business_profile_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_type: DataTypes.INTEGER,
    collective: DataTypes.CHAR,
    available_all_year: DataTypes.CHAR,
    flexible_schedules: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    price: DataTypes.NUMERIC,
    duration_type: DataTypes.INTEGER,
    time_duration: DataTypes.INTEGER,
    type_of_tour: DataTypes.INTEGER,
    before_booking: DataTypes.INTEGER,
    min_of_people: DataTypes.INTEGER,
    language_code: DataTypes.STRING,
    enabled: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    removed: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    mg_tour_id: DataTypes.STRING,
    active_user: DataTypes.STRING,
    mg_tour_body: DataTypes.STRING,
    step_validate: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    modelName: 'tb_tt_to_md_tour',
  });

  SequelizeSlugify.slugifyModel(tb_tt_to_md_tour,{
    source: ['name'],
    slugOptions: { lower: true },
    overwrite: true,
    column: 'slug',
    incrementalReplacement: '-'
  })

  return tb_tt_to_md_tour;
};