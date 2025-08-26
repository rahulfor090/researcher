import { sequelize } from '../config/db.js';
import makeUser from './User.js';
import makeArticle from './Article.js';

export const User = makeUser(sequelize);
export const Article = makeArticle(sequelize);

User.hasMany(Article, { foreignKey: 'userId' });
Article.belongsTo(User, { foreignKey: 'userId' });

export const syncDb = async () => {
  await sequelize.authenticate();
  await sequelize.sync(); // for MVP; replace with migrations later
};
