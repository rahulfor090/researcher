import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const HomeButton = sequelize.define('HomeButton', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    position: { type: DataTypes.ENUM('header', 'footer'), allowNull: false }
  }, { 
    tableName: 'home_buttons',
    timestamps: false,
    indexes: [
      { fields: ['position'] }
    ]
  });

  return HomeButton;
};


