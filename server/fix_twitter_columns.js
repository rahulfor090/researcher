import { Sequelize } from 'sequelize';
import { env } from './src/config/env.js';

// Create Sequelize instance
const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: console.log
});

// Function to add Twitter columns
async function addTwitterColumns() {
  try {
    // Check if columns exist
    const [results] = await sequelize.query('DESCRIBE users');
    const columns = results.map(r => r.Field);
    
    // Add missing columns
    if (!columns.includes('twitterId')) {
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN twitterId VARCHAR(255) UNIQUE AFTER password
      `);
      console.log('Added twitterId column');
    }
    
    if (!columns.includes('twitterToken')) {
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN twitterToken VARCHAR(255) AFTER twitterId
      `);
      console.log('Added twitterToken column');
    }
    
    if (!columns.includes('twitterTokenSecret')) {
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN twitterTokenSecret VARCHAR(255) AFTER twitterToken
      `);
      console.log('Added twitterTokenSecret column');
    }
    
    console.log('Twitter columns check/addition completed successfully');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the function
addTwitterColumns()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });