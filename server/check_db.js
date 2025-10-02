import db from './src/models/index.js';

async function checkDatabase() {
  try {
    const desc = await db.sequelize.getQueryInterface().describeTable('users');
    console.log('Current users table structure:');
    Object.keys(desc).forEach(col => {
      console.log(`- ${col}: ${desc[col].type}`);
    });
    
    // Check specifically for OAuth fields
    const oauthFields = ['googleId', 'twitterId', 'linkedinId', 'password_set'];
    console.log('\nOAuth fields status:');
    oauthFields.forEach(field => {
      console.log(`- ${field}: ${desc[field] ? 'EXISTS' : 'MISSING'}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkDatabase();