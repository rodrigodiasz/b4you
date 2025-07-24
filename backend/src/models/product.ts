import { DataTypes, Model, Sequelize } from "sequelize";

export class Product extends Model {
  public id: number | string | undefined;
  public name: string | undefined;
  public price: number | undefined;
  public description: string | undefined;
  public stock: number | undefined;
  public category: string | undefined;
  public readonly createdAt: Date | undefined;
  public readonly updatedAt: Date | undefined;
}

export function initProductModel(sequelize: Sequelize) {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Outros",
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
    }
  );
}
