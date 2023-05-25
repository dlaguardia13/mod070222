import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../src/db/db.js";

import { CryptoCurrency } from './tb_cryptocurrency.model.js'

export const UserCryptocurrency = sequelize.define(
  "tb_as_user_cryptocurrency",
  {
    as_user_crytocurrency_id: {
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
    stock: {
        allowNull: false,
        type: DataTypes.FLOAT
    }
  },
  {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tb_as_user_cryptocurrency',
    classMethods: {}
  }
);

UserCryptocurrency.belongsTo(CryptoCurrency, {
  foreignKey: "tb_cryptocurrency_cryptocurrency_id",
  targetKey: "cryptocurrency_id"
});
 