import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ArticleFile = sequelize.define('ArticleFile', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    article_id: { type: DataTypes.INTEGER, allowNull: false },
    file_name: { type: DataTypes.STRING(255), allowNull: false },
    pages: { type: DataTypes.INTEGER },
    info: { type: DataTypes.JSON },
    summary: { type: DataTypes.TEXT },
    hashtags: { type: DataTypes.TEXT },
  }, { tableName: 'article_files' });

  return ArticleFile;
};
