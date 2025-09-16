import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Collection = sequelize.define('Collection', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    userId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    collection_name: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    }
  }, { 
    tableName: 'collections',
    timestamps: true
  });

  return Collection;
};