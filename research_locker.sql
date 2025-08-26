-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 26, 2025 at 02:08 PM
-- Server version: 9.1.0
-- PHP Version: 8.1.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `research_locker`
--

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` varchar(500) NOT NULL,
  `authors` varchar(500) DEFAULT NULL,
  `journal` varchar(255) DEFAULT NULL,
  `doi` varchar(255) DEFAULT NULL,
  `url` text NOT NULL,
  `abstract` text,
  `purchaseDate` date DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `userId`, `title`, `authors`, `journal`, `doi`, `url`, `abstract`, `purchaseDate`, `price`, `tags`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Phenotyping non-dilated left ventricular cardiomyopathy: just the beginning of the journey', 'Pawel Rubis', 'Heart', '10.1136/heartjnl-2025-326778', 'https://heart.bmj.com/content/early/2025/08/24/heartjnl-2025-326778', '', '2025-08-26', NULL, '[]', '2025-08-26 13:52:14', '2025-08-26 13:52:14'),
(2, 2, 'Biogeography shapes the TE landscape of Drosophila melanogaster', 'Riccardo Pianezza, Robert Kofler', 'bioRxiv', '10.1101/2025.05.22.655554', 'https://www.biorxiv.org/content/10.1101/2025.05.22.655554v1', '<h3>Abstract</h3>\n<p>The abundance and composition of transposable elements (TEs) varies widely across species, yet the evolutionary forces shaping this diversity remain poorly understood. Using 285 recently published genomes from drosophilid species, we investigated the evolutionary origins of the ≈130 TE families present in <i>D. melanogaster</i> and found that 79 were exchanged via horizontal transposon transfer (HTT) with other drosophilids.</p><p>Most HTT events involved closely related species such as <i>D. simulans, D. mauritiana</i>, and <i>D. teissieri</i>, although transfers from more distantly related taxa were also observed. Notably, <i>D. melanogaster</i> appears to be a net recipient of HTTs, acquiring about three times as many TEs as it donated.</p><p>Geographic patterns reveal that most HTTs involved Afrotropical species, reflecting <i>D. melanogaster</i> ‘s ancestral range, with fewer involving species from the Neotropics, a region which <i>D. melanogaster</i> invaded only ≈200 years ago. Despite colonizing the Nearctic, Australasian, and Palearctic regions between 200–2000 years ago, we found no evidence of HTT with species from those areas.</p><p>Nonetheless, an analysis of drosophilids from each biogeographic realm shows that HTT is widespread in each realm, with 3–55% of the genome in each species derived from HTT. Strikingly, a considerable portion of the genome is shared among all species inhabiting the same realm —regardless of phylogenetic distance—indicating that geographic overlap, rather than shared ancestry, is a primary driver of TE composition. These findings highlight biogeography as a major force shaping the TE landscape and underscore the importance of ecological interactions in genome evolution.</p>', '2025-08-26', NULL, '[]', '2025-08-26 13:54:04', '2025-08-26 13:54:04'),
(3, 2, 'Phenotyping non-dilated left ventricular cardiomyopathy: just the beginning of the journey', 'Pawel Rubis', 'Heart (British Cardiac Society)', '10.1136/heartjnl-2025-326778', 'https://pubmed.ncbi.nlm.nih.gov/40850741/', 'Phenotyping non-dilated left ventricular cardiomyopathy: just the beginning of the journey', '2025-08-26', NULL, '[]', '2025-08-26 13:56:51', '2025-08-26 13:56:51'),
(4, 2, 'Phenotyping non-dilated left ventricular cardiomyopathy: just the beginning of the journey', 'Pawel Rubis', 'Heart', '10.1136/heartjnl-2025-326778', 'https://heart.bmj.com/content/early/2025/08/24/heartjnl-2025-326778', '', '2025-08-26', NULL, '[]', '2025-08-26 14:01:06', '2025-08-26 14:01:06');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `email` varchar(160) NOT NULL,
  `password` varchar(200) NOT NULL,
  `plan` enum('free','pro') DEFAULT 'free',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `plan`, `createdAt`, `updatedAt`) VALUES
(2, 'Ansh', 'ansh@itfosters.com', '$2b$10$eUz8.pnfDfuYPisUY2OUGOdQQc.dyq/Ba7WwHNZo8QtUdxX0Fq6Y2', 'free', '2025-08-26 13:50:43', '2025-08-26 13:50:43');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
