import Sequelize from "sequelize";

export const sequelize = new Sequelize(
  "cryptocurrency", // db name,
  "postgres", // username
  "hola1234", // password
  {
    host: "localhost",
    dialect: "postgres",
  }
);