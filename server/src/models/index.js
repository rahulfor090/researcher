import { sequelize } from '../config/db.js';
import Sequelize from 'sequelize';
import makeUser from './User.js';
import makeArticle from './Article.js';
import makeTag from './tag.js';
import makeArticleTag from './articletag.js';

// Model definitions
export const User = makeUser(sequelize, Sequelize.DataTypes);
export const Article = makeArticle(sequelize, Sequelize.DataTypes);
export const Tag = makeTag(sequelize, Sequelize.DataTypes);
export const ArticleTag = makeArticleTag(sequelize, Sequelize.DataTypes);

// Associations
User.hasMany(Article, { foreignKey: 'userId' });
Article.belongsTo(User, { foreignKey: 'userId' });

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