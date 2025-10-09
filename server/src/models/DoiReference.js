import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const DoiReference = sequelize.define(
    'DoiReference',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      doi: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      reference: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'doi_references',
      timestamps: false, // We're managing createdAt manually
      indexes: [
        { unique: true, fields: ['doi'] },
      ],
    }
  );

  return DoiReference;
};