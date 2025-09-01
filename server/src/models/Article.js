import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Article = sequelize.define('Article', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(500), allowNull: false },
    authors: { type: DataTypes.STRING(500) },
    journal: { type: DataTypes.STRING(255) },
    doi: { type: DataTypes.STRING(255) },
    url: { type: DataTypes.TEXT, allowNull: false },
    abstract: { type: DataTypes.TEXT },
    purchaseDate: { type: DataTypes.DATEONLY },
    price: { type: DataTypes.DECIMAL(10,2) },
    tags: { type: DataTypes.JSON },
    file_name: { type: DataTypes.STRING(255) }
  }, { tableName: 'articles' });

  return Article;
};
