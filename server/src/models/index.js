import { sequelize } from '../config/db.js';
import makeUser from './User.js';
import makeArticle from './Article.js';
import makeAuthor from './Author.js';
import makeArticleAuthor from './ArticleAuthor.js';

export const User = makeUser(sequelize);
export const Article = makeArticle(sequelize);
export const Author = makeAuthor(sequelize);
export const ArticleAuthor = makeArticleAuthor(sequelize);

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

export const syncDb = async () => {
  await sequelize.authenticate();
  await sequelize.sync(); // for MVP; replace with migrations later
};
