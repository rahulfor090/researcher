import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PdfImage = sequelize.define('PdfImage', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    article_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'articles',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    images_name: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: true }
  }, { 
    tableName: 'pdf_images',
    timestamps: false
  });

  // Optionally, if you want to add associations in the model file:
  PdfImage.associate = (models) => {
    PdfImage.belongsTo(models.Article, { foreignKey: 'article_id', as: 'article' });
  };

  return PdfImage;
};