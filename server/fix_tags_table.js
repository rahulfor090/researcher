import { sequelize } from './src/config/db.js';

async function fixTagsTable() {
  try {
    console.log('🔧 Starting tags table fix...');
    
    // Check if tags table exists and get its current structure
    const [tables] = await sequelize.query("SHOW TABLES LIKE 'tags'");
    
    if (tables.length === 0) {
      console.log('📝 Tags table does not exist, will be created during sync');
      return;
    }
    
    console.log('📊 Checking current indexes on tags table...');
    const [indexes] = await sequelize.query("SHOW INDEX FROM tags");
    console.log(`Found ${indexes.length} indexes on tags table`);
    
    if (indexes.length > 10) { // If there are too many indexes
      console.log('⚠️ Too many indexes detected, recreating table...');
      
      // 1. Create backup of existing data
      console.log('💾 Creating backup of existing tags...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS tags_backup AS 
        SELECT DISTINCT id, name FROM tags WHERE name IS NOT NULL AND name != ''
      `);
      
      // 2. Drop the problematic table
      console.log('🗑️ Dropping problematic tags table...');
      await sequelize.query('DROP TABLE IF EXISTS tags');
      
      // 3. Recreate table with proper structure
      console.log('🏗️ Creating new tags table...');
      await sequelize.query(`
        CREATE TABLE tags (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(191) NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY unique_name (name),
          INDEX idx_tags_name (name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      // 4. Restore data
      console.log('📥 Restoring data from backup...');
      await sequelize.query(`
        INSERT IGNORE INTO tags (id, name, createdAt, updatedAt) 
        SELECT id, name, NOW(), NOW() FROM tags_backup 
        ORDER BY id
      `);
      
      // 5. Clean up backup
      console.log('🧹 Cleaning up backup table...');
      await sequelize.query('DROP TABLE IF EXISTS tags_backup');
      
      console.log('✅ Tags table has been successfully recreated!');
    } else {
      console.log('✅ Tags table indexes are within normal limits');
    }
    
    // Show final table structure
    const [finalIndexes] = await sequelize.query("SHOW INDEX FROM tags");
    console.log(`📊 Final index count: ${finalIndexes.length}`);
    
    const [tableInfo] = await sequelize.query("DESCRIBE tags");
    console.log('📋 Final table structure:', tableInfo);
    
  } catch (error) {
    console.error('❌ Error fixing tags table:', error);
    throw error;
  }
}

// Run the fix
fixTagsTable()
  .then(() => {
    console.log('🎉 Tags table fix completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed to fix tags table:', error);
    process.exit(1);
  });