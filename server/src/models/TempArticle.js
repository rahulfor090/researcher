import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TempArticle = sequelize.define('TempArticle', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tempUserId: { type: DataTypes.STRING(255), allowNull: false },
    title: { type: DataTypes.STRING(500), allowNull: false },
    authors: { type: DataTypes.STRING(500) },
    journal: { type: DataTypes.STRING(255) },
    doi: { type: DataTypes.STRING(255) },
    url: { type: DataTypes.TEXT, allowNull: false },
    purchaseDate: { type: DataTypes.DATEONLY },
    price: { type: DataTypes.DECIMAL(10,2) },
    tags: { type: DataTypes.JSON },
    file_name: { type: DataTypes.STRING(255)},
    summary: { type: DataTypes.TEXT},
    hashtags: { type: DataTypes.TEXT}
  }, { tableName: 'temp_articles' });

  return TempArticle;
};