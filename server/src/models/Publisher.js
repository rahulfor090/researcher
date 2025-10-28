import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Publisher = sequelize.define('Publisher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'publishers',
    timestamps: true
  });

  Publisher.associate = (models) => {
    // Many-to-Many relationship with Articles through article_publishers
    Publisher.belongsToMany(models.Article, {
      through: 'article_publishers',
      foreignKey: 'publisher_id',
      otherKey: 'article_id',
      as: 'articles'
    });
  };

  return Publisher; 
};  