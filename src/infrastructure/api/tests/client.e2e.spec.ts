import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import { migrator } from "../../db/sequelize/config/migrator";
import { app } from "../express";
import {ClientModel} from "../../../modules/client-adm/repository/client.model";

describe("Client", () => {
  let sequelize: Sequelize;
  let migration: Umzug<Sequelize>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([ClientModel]);

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  describe("/POST client", () => {
    it("should post a client without id", async () => {
      const name = "Zlatan Ibrahimovic";
      const email = "zlatan@fifa.com";
      const document = "677.403.207-90";
      const street = "Rua Professor Waldemar Marques Pires";
      const number = "321";
      const complement = "";
      const city = "Rio de Janeiro";
      const state = "Rio de Janeiro";
      const zipCode = "64600-007";
      const res = await request(app).post("/clients").send({
        name,
        email,
        document,
        street,
        number,
        complement,
        city,
        state,
        zipCode,
      });
      expect(res.statusCode).toBe(201);
    });

    it("should post a product with id", async () => {
      const id = "cdd60e40-b866-4e4e-8cc6-75fa9cabf30a";
      const name = "Maria Sharapova";
      const email = "sharapova@tennis.com";
      const document = "446.970.474-19";
      const street = "Rua Anísio de Abreu";
      const number = "644";
      const complement = "";
      const city = "Parnaíba";
      const state = "Piauí";
      const zipCode = "95076-631";
      const res = await request(app)
        .post("/clients")
        .send({
          id,
          name,
          email,
          document,
          street,
          number,
          complement,
          city,
          state,
          zipCode,
        });
      expect(res.statusCode).toBe(201);
    });
  });
});
