import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TempUser = sequelize.define(
    'TempUser',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      tempUserId: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'temp_users',
      timestamps: false,
      indexes: [
        { unique: true, fields: ['tempUserId'] },
      ],
    }
  );

  return TempUser;
};