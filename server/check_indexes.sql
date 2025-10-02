-- Check indexes on the users table
SHOW INDEX FROM users;

-- Drop all non-essential indexes (keeping only PRIMARY and necessary unique constraints)
-- First, let's see what indexes exist and then we'll clean them up

-- This will show us all the indexes
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    NON_UNIQUE
FROM 
    INFORMATION_SCHEMA.STATISTICS 
WHERE 
    TABLE_SCHEMA = 'research_locker' 
    AND TABLE_NAME = 'users'
ORDER BY 
    INDEX_NAME, SEQ_IN_INDEX;