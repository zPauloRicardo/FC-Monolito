import { Sequelize } from "sequelize-typescript";
import { migrator } from "./migrator";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: true,
});

migrator(sequelize).runAsCLI();
