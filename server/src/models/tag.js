export default (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(191),
        unique: true,
        allowNull: false,
      },
    },
    {
      tableName: 'tags',
      timestamps: false,
      // REMOVED: Duplicate indexes array
    }
  );

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Article, {
      through: models.ArticleTag,
      foreignKey: 'tag_id',
      otherKey: 'article_id',
    });
  };

  return Tag;
};