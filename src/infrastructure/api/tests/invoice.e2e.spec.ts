import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import { migrator } from "../../db/sequelize/config/migrator";
import { app } from "../express";
import {ClientModel} from "../../../modules/client-adm/repository/client.model";
import {InvoiceModel} from "../../../modules/invoice/repository/invoice.model";
import {InvoiceProductModel} from "../../../modules/invoice/repository/invoice-product.model";

describe("Invoice", () => {
  let sequelize: Sequelize;
  let migration: Umzug<Sequelize>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([ClientModel, InvoiceModel, InvoiceProductModel]);

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  describe("/GET :id", () => {
    it("should get an invoice with the given id", async () => {
      const products: any[] = [
        {
          id: "p1",
          invoice_id: "i1",
          name: "Apple notebook MacBook Pro",
          price: 22999.0
        },
        {
          id: "p2",
          invoice_id: "i1",
          name: "Notebook Apple MacBook Pro",
          price: 14398.8
        },
        {
          id: "p3",
          invoice_id: "i1",
          name: "Apple notebook MacBook Pro",
          price: 17999.0
        },
      ];

      const total = products.reduce((acc, item) => acc + item.price, 0);

      const invoice = {
        id: "i1",
        name: "Cliente 1",
        document: "12345678900",
        street: "Rua",
        number: "1",
        complement: "Ap 2",
        city: "Tangamandapio",
        state: "EX",
        zipCode: "00000000",
        total,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await InvoiceModel.create(invoice);
      await InvoiceProductModel.bulkCreate(products);

      const res = await request(app).get(`/invoice/${invoice.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(invoice.id);
      expect(res.body.name).toBe(invoice.name);
      expect(res.body.document).toBe(invoice.document);
      expect(res.body.address).toMatchObject({
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
      });
      expect(res.body.items).toHaveLength(products.length);
      expect(res.body.total).toBe(total);
    });
  });
});
