import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ArticleAuthor = sequelize.define('ArticleAuthor', {
    article_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    author_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    }
  }, { 
    tableName: 'article_authors',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['article_id', 'author_id']
      }
    ]
  });

  return ArticleAuthor;
};
