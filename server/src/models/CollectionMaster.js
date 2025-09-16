import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const CollectionMaster = sequelize.define('CollectionMaster', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    collection_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'collections',
        key: 'id'
      }
    },
    article_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'articles',
        key: 'id'
      }
    }
  }, { 
    tableName: 'collection_masters',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['collection_id', 'article_id'],
        name: 'unique_collection_article'
      }
    ]
  });

  return CollectionMaster;
};