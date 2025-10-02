-- Fix tags table with too many keys
-- Drop the existing tags table and recreate it properly

-- First, save any existing data
CREATE TABLE IF NOT EXISTS tags_backup AS SELECT * FROM tags;

-- Drop the problematic table
DROP TABLE IF EXISTS tags;

-- Recreate the table with proper structure
CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL UNIQUE,
  INDEX idx_tags_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Restore data from backup (remove duplicates)
INSERT IGNORE INTO tags (id, name) 
SELECT id, name FROM tags_backup 
WHERE name IS NOT NULL AND name != '';

-- Clean up backup table
DROP TABLE IF EXISTS tags_backup;

-- Show the final table structure
DESCRIBE tags;
SHOW INDEX FROM tags;