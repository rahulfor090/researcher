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
    },
    // Add user_id for user-scoped tags
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'article_tags',
    timestamps: false
  });

  return ArticleTag;
};