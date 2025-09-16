export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(191),
      unique: true,
      allowNull: false
    }
  }, {
    tableName: 'tags',
    timestamps: false
  });

  return Tag;
};