import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), unique: true, allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: true }, // Allow null for OAuth users
    plan: { type: DataTypes.ENUM('free','pro'), defaultValue: 'free' },
    phone_number: { type: DataTypes.STRING(20), allowNull: true },
    profile_image: { 
      type: DataTypes.STRING(255), 
      allowNull: true
    }, 
    gender: { type: DataTypes.ENUM('Male', 'Female', 'Other'), allowNull: true },
    university: { type: DataTypes.STRING(255), allowNull: true },
    department: { type: DataTypes.STRING(255), allowNull: true },
    program: { type: DataTypes.STRING(255), allowNull: true },
    year_of_study: { type: DataTypes.STRING(50), allowNull: true },
    research_area: { type: DataTypes.TEXT, allowNull: true },
    research_interests: { type: DataTypes.TEXT, allowNull: true },
    publications: { type: DataTypes.TEXT, allowNull: true },
    linkedin_url: { type: DataTypes.STRING(255), allowNull: true },
    google_scholar_url: { type: DataTypes.STRING(255), allowNull: true },
    orcid_id: { type: DataTypes.STRING(50), allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    skills: { type: DataTypes.TEXT, allowNull: true },
    twitterId: { type: DataTypes.STRING(50), allowNull: true, unique: true },
    avatar: { type: DataTypes.TEXT, allowNull: true },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: 'users' });
  

  return User;
};

