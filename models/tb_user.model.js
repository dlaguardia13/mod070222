import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../src/db/db.js";

import { UserCryptocurrency } from "./tb_as_user_cryptocurrency.model.js";
import { BankAccount } from "./tb_bank_account.model.js";
import { UserOperationLog } from "./tb_user_operation_log.model.js";

export const User = sequelize.define(
  "tb_user",
  {
    user_id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    last_name: {
        allowNull: false,
        type: DataTypes.STRING
    },  
    email: {
        allowNull: false,
        type: DataTypes.STRING
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tb_user',
    classMethods: {}
  }
);

User.hasMany(UserCryptocurrency, {
  foreignKey: "tb_user_user_id",
  sourceKey: "user_id",
});

User.hasMany(BankAccount, {
  foreignKey: "tb_user_user_id",
  sourceKey: "user_id",
});

User.hasMany(UserOperationLog, {
  foreignKey: "tb_user_user_id",
  sourceKey: "user_id",
});

UserOperationLog.belongsTo(User, {
  foreignKey: "tb_user_user_id",
  targetKey: "user_id"
});