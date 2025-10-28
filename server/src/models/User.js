import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(160),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: true, // For OAuth users who haven't set password
      },
      plan: {
        type: DataTypes.ENUM('free', 'pro'),
        defaultValue: 'free',
      },
      // OAuth fields
      googleId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      twitterId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      twitterToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      twitterTokenSecret: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      linkedinId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      linkedinToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      // Password requirement flag for OAuth users
      password_set: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      profile_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true,
      },
      university: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      program: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      year_of_study: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      research_area: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      research_interests: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      publications: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      linkedin_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      google_scholar_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      orcid_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      skills: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      // REMOVED: Duplicate indexes array - using column-level unique constraints instead
    }
  );

  return User;
};