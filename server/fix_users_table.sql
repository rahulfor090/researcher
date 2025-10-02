-- Clean up users table indexes
-- WARNING: Run this carefully and backup your database first

USE research_locker;

-- Check current indexes
SELECT 
    CONCAT('DROP INDEX ', INDEX_NAME, ' ON ', TABLE_NAME, ';') as drop_statement
FROM 
    INFORMATION_SCHEMA.STATISTICS 
WHERE 
    TABLE_SCHEMA = 'research_locker' 
    AND TABLE_NAME = 'users'
    AND INDEX_NAME != 'PRIMARY'
    AND INDEX_NAME NOT LIKE '%email%'  -- Keep email unique constraint
ORDER BY 
    INDEX_NAME;

-- Alternatively, if you want to recreate the table fresh:
-- (Backup your data first!)

-- Step 1: Create backup table
CREATE TABLE users_backup AS SELECT * FROM users;

-- Step 2: Drop the problematic table
DROP TABLE users;

-- Step 3: Recreate with minimal indexes
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    password VARCHAR(200) NOT NULL,
    plan ENUM('free','pro') DEFAULT 'free',
    phone_number VARCHAR(20),
    profile_image VARCHAR(255),
    gender ENUM('Male', 'Female', 'Other'),
    university VARCHAR(255),
    department VARCHAR(255),
    program VARCHAR(255),
    year_of_study VARCHAR(50),
    research_area TEXT,
    research_interests TEXT,
    publications TEXT,
    linkedin_url VARCHAR(255),
    google_scholar_url VARCHAR(255),
    orcid_id VARCHAR(50),
    bio TEXT,
    skills TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 4: Restore data
INSERT INTO users SELECT * FROM users_backup;

-- Step 5: Drop backup table (optional)
-- DROP TABLE users_backup;