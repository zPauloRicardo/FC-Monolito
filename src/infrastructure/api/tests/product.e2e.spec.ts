import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import { migrator } from "../../db/sequelize/config/migrator";
import { app } from "../express";
import {ProductModel} from "../../../modules/product-adm/repository/product.model";

describe("Product", () => {
  let sequelize: Sequelize;
  let migration: Umzug<Sequelize>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([ProductModel]);

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  describe("/POST product", () => {
    it("should post a product without id", async () => {
      const name = "Apple notebook MacBook Pro de 13 polegadas";
      const description =
        "Chip M2 da Apple com CPU de oito núcleos e GPU de dez núcleos, de 256 GB SSD - Cinza espacial ";
      const purchasePrice = 12500.9;
      const salesPrice = 14687;
      const stock = 10;
      const res = await request(app)
        .post("/products")
        .send({ name, description, purchasePrice, salesPrice, stock });
      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        name,
        description,
        purchasePrice,
        salesPrice,
        stock,
      });
      expect(res.body).toHaveProperty("id");
    });

    it("should post a product with id", async () => {
      const id = "cdd60e40-b866-4e4e-8cc6-75fa9cabf30a";
      const name = "Apple notebook MacBook Air de 13 polegadas";
      const description =
        "Chip M2 da Apple com CPU de oito núcleos e GPU de oito núcleos, de 256 GB SSD - Cinza espacial";
      const purchasePrice = 9888.0;
      const salesPrice = 10899.0;
      const stock = 5;
      const res = await request(app)
        .post("/products")
        .send({ id, name, description, purchasePrice, salesPrice, stock });
      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        id,
        name,
        description,
        purchasePrice,
        salesPrice,
        stock,
      });
    });
  });
});
