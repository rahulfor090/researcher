import { sequelize } from '../config/db.js';
import Sequelize from 'sequelize';
import makeUser from './User.js';
import makeArticle from './Article.js';
import makeTag from './tag.js';
import makeArticleTag from './articletag.js';
import makeAuthor from './Author.js';
import makeArticleAuthor from './ArticleAuthor.js';
import makeUserPlan from './UserPlan.js';
import makeCollection from './Collection.js';
import makeCollectionMaster from './CollectionMaster.js';
// Import DOI reference model
import makeDoiReference from './DoiReference.js';
// TEMP MODELS
import makeTempUser from './TempUser.js';
import makeTempArticle from './TempArticle.js';
// PDF Images model
import makePdfImage from './pdfImage.js'; // <-- Import your model

// Import Paypal/Payment model
import makePayment from './Payments.js';

// Add UserPlan model
export const UserPlan = makeUserPlan(sequelize, Sequelize.DataTypes);

export const Author = makeAuthor(sequelize);
export const ArticleAuthor = makeArticleAuthor(sequelize);
export const User = makeUser(sequelize, Sequelize.DataTypes);
export const Article = makeArticle(sequelize, Sequelize.DataTypes);
export const Tag = makeTag(sequelize, Sequelize.DataTypes);
export const ArticleTag = makeArticleTag(sequelize, Sequelize.DataTypes);

// Initialize collection models
export const Collection = makeCollection(sequelize, Sequelize.DataTypes);
export const CollectionMaster = makeCollectionMaster(sequelize, Sequelize.DataTypes);

// Initialize DOI reference model
export const DoiReference = makeDoiReference(sequelize);
// TEMP MODELS
export const TempUser = makeTempUser(sequelize, Sequelize.DataTypes);
export const TempArticle = makeTempArticle(sequelize, Sequelize.DataTypes);

// PDF Images model
export const PdfImage = makePdfImage(sequelize); // <-- Export and initialize the model

// Payment model
export const Payment = makePayment(sequelize); // <-- Export and initialize the Payment model

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
Author.belongsToMany(Article, 
  { 
    through: ArticleAuthor, 
    foreignKey: 'author_id',
    otherKey: 'article_id',
    as: 'articles'
  }
);

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

// Collection associations
User.hasMany(Collection, { foreignKey: 'userId' });
Collection.belongsTo(User, { foreignKey: 'userId' });

// Collection-Article many-to-many through CollectionMaster
Collection.belongsToMany(Article, {
  through: CollectionMaster,
  foreignKey: 'collection_id',
  otherKey: 'article_id',
  as: 'articles'
});
Article.belongsToMany(Collection, {
  through: CollectionMaster,
  foreignKey: 'article_id',
  otherKey: 'collection_id',
  as: 'collections'
});

// Direct associations for junction table
Collection.hasMany(CollectionMaster, { foreignKey: 'collection_id' });
CollectionMaster.belongsTo(Collection, { foreignKey: 'collection_id' });
Article.hasMany(CollectionMaster, { foreignKey: 'article_id' });
CollectionMaster.belongsTo(Article, { foreignKey: 'article_id' });

// PDF Images <-> Article association
PdfImage.belongsTo(Article, { foreignKey: 'article_id', as: 'article' });
Article.hasMany(PdfImage, { foreignKey: 'article_id', as: 'pdfImages' });

// TEMP MODELS associations (if needed, you can add them here, for now just basic models)

// Sync function
export const syncDb = async () => {
  await sequelize.authenticate();
  // Auto-alter in dev to add missing columns (e.g., linkedinId, twitterId)
  await sequelize.sync({ alter: true });
};

// Default export for ES module compatibility, now with UserPlan, Collections, Temp models, PdfImage, Payment
export default {
  Author,
  ArticleAuthor,
  User,
  Article,
  Tag,
  ArticleTag,
  UserPlan,
  Collection,
  CollectionMaster,
  TempUser,
  TempArticle,
  PdfImage,
  Payment,
  DoiReference,
  syncDb,
  sequelize
};