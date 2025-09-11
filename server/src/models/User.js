import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: true }, // Allow null for OAuth users
    plan: { type: DataTypes.ENUM('free','pro'), defaultValue: 'free' },
    phone_number: { type: DataTypes.STRING(20), allowNull: true, defaultValue: '' },
    profile_image: { 
      type: DataTypes.STRING(255), 
      allowNull: true,
      defaultValue: ''
    }, 
    gender: { type: DataTypes.ENUM('Male', 'Female', 'Other'), allowNull: true, defaultValue: 'Other' },
    university: { type: DataTypes.STRING(255), allowNull: true, defaultValue: '' },
    department: { type: DataTypes.STRING(255), allowNull: true, defaultValue: '' },
    program: { type: DataTypes.STRING(255), allowNull: true, defaultValue: '' },
    year_of_study: { type: DataTypes.STRING(50), allowNull: true, defaultValue: '' },
    research_area: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
    research_interests: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
    publications: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
    linkedin_url: { type: DataTypes.STRING(255), allowNull: true, defaultValue: '' },
    google_scholar_url: { type: DataTypes.STRING(255), allowNull: true, defaultValue: '' },
    orcid_id: { type: DataTypes.STRING(50), allowNull: true, defaultValue: '' },
    bio: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
    skills: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },

  }, { tableName: 'users' });
  

  return User;
};

