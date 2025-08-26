import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(200), allowNull: false },
    plan: { type: DataTypes.ENUM('free','pro'), defaultValue: 'free' }
  }, { tableName: 'users' });

  return User;
};
