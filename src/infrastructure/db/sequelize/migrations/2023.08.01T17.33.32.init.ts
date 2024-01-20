import { DataTypes } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { MigrationFn } from "umzug";

export const up: MigrationFn<Sequelize> = async ({ context }) => {
  await context.getQueryInterface().createTable("client", {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  await context.getQueryInterface().createTable("orders", {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: "client",
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  await context.getQueryInterface().createTable('invoice-items', {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false
    },
    invoice_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    price: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  });

  await context.getQueryInterface().createTable("invoices", {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  await context.getQueryInterface().createTable("products", {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: "orders",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    purchasePrice: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    salesPrice: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    price: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    stock: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  await context.getQueryInterface().createTable("transactions", {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    amount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};
export const down: MigrationFn<Sequelize> = async ({ context }) => {
  await context.getQueryInterface().dropTable("products");
};
