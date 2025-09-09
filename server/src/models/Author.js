import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Author = sequelize.define('Author', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    name: { 
      type: DataTypes.STRING(255), 
      allowNull: false
    }
  }, { 
    tableName: 'authors',
    timestamps: false,
    indexes: [
      {
        fields: ['name']
      }
    ]
  });

  return Author;
};
