import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../src/db/db.js";

import { RealCurrency } from "./tb_realcurrency.model.js";

export const BankAccount = sequelize.define(
  "tb_bank_account",
  {
    bank_account_id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    tb_user_user_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    tb_realcurrency_realcurrency_id: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    no_account: {
        allowNull: false,
        type: DataTypes.STRING,
    },  
    balance: {
        allowNull: false,
        type: DataTypes.FLOAT
    }
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tb_bank_account',
    classMethods: {}
  }
);

BankAccount.belongsTo(RealCurrency, {
  foreignKey: "tb_realcurrency_realcurrency_id",
  targetKey: "realcurrency_id"
});
 