-- Create doi_references table for storing DOI references
USE research_locker;

CREATE TABLE IF NOT EXISTS `doi_references` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doi` varchar(255) NOT NULL,
  `reference` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_doi` (`doi`),
  KEY `idx_doi` (`doi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify table creation
DESCRIBE doi_references;