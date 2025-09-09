import { sequelize } from '../config/db.js';
import Sequelize from 'sequelize';
import makeUser from './User.js';
import makeArticle from './Article.js';
import makeTag from './tag.js';
import makeArticleTag from './articletag.js';
import makeAuthor from './Author.js';
import makeArticleAuthor from './ArticleAuthor.js';

export const Author = makeAuthor(sequelize);
export const ArticleAuthor = makeArticleAuthor(sequelize);
export const User = makeUser(sequelize, Sequelize.DataTypes);
export const Article = makeArticle(sequelize, Sequelize.DataTypes);
export const Tag = makeTag(sequelize, Sequelize.DataTypes);
export const ArticleTag = makeArticleTag(sequelize, Sequelize.DataTypes);


// User-Article associations
User.hasMany(Article, { foreignKey: 'userId' });
Article.belongsTo(User, { foreignKey: 'userId' });

// Article-Author many-to-many associations
Article.belongsToMany(Author, { 
  through: ArticleAuthor, 
  foreignKey: 'article_id',
  otherKey: 'author_id',
  as: 'authorList'
});
Author.belongsToMany(Article, { 
  through: ArticleAuthor, 
  foreignKey: 'author_id',
  otherKey: 'article_id',
  as: 'articles'
});

// Direct associations for junction table
Article.hasMany(ArticleAuthor, { foreignKey: 'article_id' });
ArticleAuthor.belongsTo(Article, { foreignKey: 'article_id' });
Author.hasMany(ArticleAuthor, { foreignKey: 'author_id' });
ArticleAuthor.belongsTo(Author, { foreignKey: 'author_id' });


// Many-to-many association between Article and Tag using article_tags join table
Article.belongsToMany(Tag, {
  through: ArticleTag,
  foreignKey: 'article_id',
  otherKey: 'tag_id',
});
Tag.belongsToMany(Article, {
  through: ArticleTag,
  foreignKey: 'tag_id',
  otherKey: 'article_id',
});


export const syncDb = async () => {
  await sequelize.authenticate();
  await sequelize.sync(); // For MVP, not for production migrations
};