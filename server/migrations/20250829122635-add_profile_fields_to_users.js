'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'department_institution', {
      type: Sequelize.STRING(500),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'biography_overview', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'profile_image', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'gender', {
      type: Sequelize.ENUM('Male', 'Female', 'Other'),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'university', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'department', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'program', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'year_of_study', {
      type: Sequelize.STRING(50),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'research_area', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'research_interests', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'publications', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'linkedin_url', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'google_scholar_url', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'orcid_id', {
      type: Sequelize.STRING(50),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'skills', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'phone_number', {
      type: Sequelize.STRING(20),
      allowNull: true
    });

    // re-add createdAt if missing
    await queryInterface.addColumn('users', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    // re-add updatedAt if missing
    await queryInterface.addColumn('users', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'department_institution');
    await queryInterface.removeColumn('users', 'biography_overview');
    await queryInterface.removeColumn('users', 'profile_image');
    await queryInterface.removeColumn('users', 'gender');
    await queryInterface.removeColumn('users', 'bio');
    await queryInterface.removeColumn('users', 'university');
    await queryInterface.removeColumn('users', 'department');
    await queryInterface.removeColumn('users', 'program');
    await queryInterface.removeColumn('users', 'year_of_study');
    await queryInterface.removeColumn('users', 'research_area');
    await queryInterface.removeColumn('users', 'research_interests');
    await queryInterface.removeColumn('users', 'publications');
    await queryInterface.removeColumn('users', 'linkedin_url');
    await queryInterface.removeColumn('users', 'google_scholar_url');
    await queryInterface.removeColumn('users', 'orcid_id');
    await queryInterface.removeColumn('users', 'skills');
    await queryInterface.removeColumn('users', 'phone_number');
    await queryInterface.removeColumn('users', 'createdAt');
    await queryInterface.removeColumn('users', 'updatedAt');
  }
};
