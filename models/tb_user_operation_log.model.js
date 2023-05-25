import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../src/db/db.js";

import { CryptoCurrency } from './tb_cryptocurrency.model.js'
import { RealCurrency } from "./tb_realcurrency.model.js";

export const UserOperationLog = sequelize.define(
  "tb_user_operation_log",
  {
    user_op_log_id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    tb_user_user_id: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    tb_cryptocurrency_cryptocurrency_id: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    tb_realcurrency_realcurrency_id: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    type: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    exchange_side: {
        allowNull: true,
        type: DataTypes.STRING
    },
    cc_amount_b: {
        allowNull: true,
        type: DataTypes.FLOAT
    },
    cc_amount_a: {
        allowNull: true,
        type: DataTypes.FLOAT
    },
    rc_amount_b: {
        allowNull: true,
        type: DataTypes.FLOAT
    },
    rc_amount_a: {
        allowNull: true,
        type: DataTypes.FLOAT
    },
    sell_at: {
        allowNull: true,
        type: DataTypes.DATE
    },
    buy_at: {
        allowNull: true,
        type: DataTypes.DATE
    },
    exchange_at: {
        allowNull: true,
        type: DataTypes.DATE
    },
    login: {
        allowNull: true,
        type: DataTypes.DATE
    },
    logout: {
        allowNull: true,
        type: DataTypes.DATE
    },
    user_name: {
        allowNull: true,
        type: DataTypes.BOOLEAN
    },
    user_created: {
        allowNull: true,
        type: DataTypes.BOOLEAN
    }
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tb_user_operation_log',
    classMethods: {}
  }
);

UserOperationLog.belongsTo(CryptoCurrency, {
  foreignKey: "tb_cryptocurrency_cryptocurrency_id",
  targetKey: "cryptocurrency_id"
});

UserOperationLog.belongsTo(RealCurrency, {
  foreignKey: "tb_realcurrency_realcurrency_id",
  targetKey: "realcurrency_id"
});