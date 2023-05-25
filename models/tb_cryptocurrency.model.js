import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../src/db/db.js";

export const CryptoCurrency = sequelize.define(
  "tb_cryptocurrency",
  {
    cryptocurrency_id: {
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
    },  
    v_dolar: {
        allowNull: false,
        type: DataTypes.FLOAT
    },
    v_quetzal: {
        allowNull: false,
        type: DataTypes.FLOAT
    },
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tb_cryptocurrency',
    classMethods: {}
  }
);