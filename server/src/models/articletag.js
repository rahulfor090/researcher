export default (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define('ArticleTag', {
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'articles', key: 'id' }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'tags', key: 'id' }
    }
  }, {
    tableName: 'article_tags',
    timestamps: false
  });

  return ArticleTag;
};