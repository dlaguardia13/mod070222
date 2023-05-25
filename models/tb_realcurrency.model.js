import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../src/db/db.js";

export const RealCurrency = sequelize.define(
  "tb_realcurrency",
  {
    realcurrency_id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    symbol: {
        allowNull: false,
        type: DataTypes.STRING
    }
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tb_realcurrency',
    classMethods: {}
  }
);