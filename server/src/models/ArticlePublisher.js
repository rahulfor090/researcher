import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ArticlePublisher = sequelize.define('ArticlePublisher', {
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'articles',
        key: 'id'
      }
    },
    publisher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'publishers',
        key: 'id'
      }
    }
  }, {
    tableName: 'article_publishers',
    timestamps: true
  });

  return ArticlePublisher;
};
