-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 03, 2025 at 10:17 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

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
  `file_name` varchar(255) DEFAULT NULL,
  `summary` text,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `userId`, `title`, `authors`, `journal`, `doi`, `url`, `abstract`, `purchaseDate`, `price`, `tags`, `createdAt`, `updatedAt`, `file_name`, `summary`) VALUES
(2, 3, 'Biogeography shapes the TE landscape of Drosophila melanogaster', 'Riccardo Pianezza, Robert Kofler', 'bioRxiv', '10.1101/2025.05.22.655554', 'https://www.biorxiv.org/content/10.1101/2025.05.22.655554v1.full', '<h3>Abstract</h3>\n<p>The abundance and composition of transposable elements (TEs) varies widely across species, yet the evolutionary forces shaping this diversity remain poorly understood. Using 285 recently published genomes from drosophilid species, we investigated the evolutionary origins of the ≈130 TE families present in <i>D. melanogaster</i> and found that 79 were exchanged via horizontal transposon transfer (HTT) with other drosophilids.</p><p>Most HTT events involved closely related species such as <i>D. simulans, D. mauritiana</i>, and <i>D. teissieri</i>, although transfers from more distantly related taxa were also observed. Notably, <i>D. melanogaster</i> appears to be a net recipient of HTTs, acquiring about three times as many TEs as it donated.</p><p>Geographic patterns reveal that most HTTs involved Afrotropical species, reflecting <i>D. melanogaster</i> ‘s ancestral range, with fewer involving species from the Neotropics, a region which <i>D. melanogaster</i> invaded only ≈200 years ago. Despite colonizing the Nearctic, Australasian, and Palearctic regions between 200–2000 years ago, we found no evidence of HTT with species from those areas.</p><p>Nonetheless, an analysis of drosophilids from each biogeographic realm shows that HTT is widespread in each realm, with 3–55% of the genome in each species derived from HTT. Strikingly, a considerable portion of the genome is shared among all species inhabiting the same realm —regardless of phylogenetic distance—indicating that geographic overlap, rather than shared ancestry, is a primary driver of TE composition. These findings highlight biogeography as a major force shaping the TE landscape and underscore the importance of ecological interactions in genome evolution.</p>', '2025-08-27', NULL, '[]', '2025-08-27 17:42:56', '2025-08-27 17:42:56', NULL, NULL),
(6, 7, 'Prediction of Cardiovascular and Renal Complications of Diabetes by a multi-Polygenic Risk Score in Different Ethnic Groups', 'Edoh Kodji, Redha Attaoua, Mounsif Haloui, Camil Hishmih, Mirjam Seitz, Pavel Hamet, Julie Hussin, Johanne Tremblay', 'medRxiv', '10.1101/2025.06.17.25329804', 'https://www.medrxiv.org/content/10.1101/2025.06.17.25329804v1', '<h3>Abstract</h3>\n<p>We developed a multi-Polygenic risk score (multiPRS) to predict the risk of nephropathy, stroke, and myocardial infarction in people with type 2 diabetes of European descent. The underrepresentation of non-European populations remains a major challenge in genomics research. <b>Objective</b>: To evaluate the ability of our multiPRS model to accurately predict these complications in patients of African and South Asian descents. <b>Method</b>: The multiPRS was developed using 4098 participants with type 2 diabetes of European origin from the ADVANCE trial. Its predictive performance was tested on 17,574 White British, 1,145 South Asian and 749 African participants with type 2 diabetes from the UK Biobank using different machine learning prediction models, including techniques tailored for imbalanced datasets. <b>Results</b>: Globally, linear discriminant analysis and logistic regression had the best performance to predict the risk of nephropathy, stroke, and myocardial infarction in people with type 2 diabetes for the three ethnic groups. Mondrian Cross-Conformal Prediction method when added to logistic regression improved the AUROC values and case detection, particularly in South Asians and Africans, while in White British, performance varied by phenotype. <b>Conclusion</b>: Logistic regression, when used as the underlying model within the Modrian Cross-Conformal Prediction framework, improved the prediction performance, with a confidence level, of diabetes complications and allows better translation of a multiPRS derived from European populations to other ethnic groups.</p>', '2025-08-28', NULL, '[]', '2025-08-28 18:48:13', '2025-08-28 18:48:13', NULL, NULL),
(7, 7, 'Prediction of Cardiovascular and Renal Complications of Diabetes by a multi-Polygenic Risk Score in Different Ethnic Groups', 'Edoh Kodji, Redha Attaoua, Mounsif Haloui, Camil Hishmih, Mirjam Seitz, Pavel Hamet, Julie Hussin, Johanne Tremblay', 'medRxiv', '10.1101/2025.06.17.25329804', 'https://www.medrxiv.org/content/10.1101/2025.06.17.25329804v1', '<h3>Abstract</h3>\n<p>We developed a multi-Polygenic risk score (multiPRS) to predict the risk of nephropathy, stroke, and myocardial infarction in people with type 2 diabetes of European descent. The underrepresentation of non-European populations remains a major challenge in genomics research. <b>Objective</b>: To evaluate the ability of our multiPRS model to accurately predict these complications in patients of African and South Asian descents. <b>Method</b>: The multiPRS was developed using 4098 participants with type 2 diabetes of European origin from the ADVANCE trial. Its predictive performance was tested on 17,574 White British, 1,145 South Asian and 749 African participants with type 2 diabetes from the UK Biobank using different machine learning prediction models, including techniques tailored for imbalanced datasets. <b>Results</b>: Globally, linear discriminant analysis and logistic regression had the best performance to predict the risk of nephropathy, stroke, and myocardial infarction in people with type 2 diabetes for the three ethnic groups. Mondrian Cross-Conformal Prediction method when added to logistic regression improved the AUROC values and case detection, particularly in South Asians and Africans, while in White British, performance varied by phenotype. <b>Conclusion</b>: Logistic regression, when used as the underlying model within the Modrian Cross-Conformal Prediction framework, improved the prediction performance, with a confidence level, of diabetes complications and allows better translation of a multiPRS derived from European populations to other ethnic groups.</p>', '2025-08-28', NULL, '[]', '2025-08-28 18:48:40', '2025-08-28 18:48:40', NULL, NULL),
(8, 8, 'dfsdf', 'sdfsdf', NULL, 'sdfsdf', 'http://google.com', NULL, NULL, NULL, NULL, '2025-08-29 15:57:34', '2025-08-29 15:57:34', NULL, NULL),
(9, 9, 'sdfasdfa', 'assdf,fadsf', NULL, '999', 'https://google.com', NULL, NULL, NULL, NULL, '2025-08-29 17:19:17', '2025-08-29 17:19:17', NULL, NULL),
(10, 4, 'Sexual assault referral centres provide high quality support', 'Helen Saul, Brendan Deeney, Laura Swaithes, Lorna O’Doherty', 'BMJ', '10.1136/bmj.r877', 'https://www.bmj.com/content/389/bmj.r877', '<h3>The study</h3>\n<p>O’Doherty LJ, Carter G, Sleath E, et al. Health and wellbeing of survivors of sexual violence and abuse attending sexual assault referral centres in England: the MESARCH mixed-methods evaluation. <i>Health Soc Care Deliv Res</i> 2024;12:1-168.</p><p>To read the full NIHR Alert, go to: https://evidence.nihr.ac.uk/alert/sexual-assault-referral-centres-provide-high-quality-support/</p>', '2025-08-29', NULL, '[]', '2025-08-29 17:22:20', '2025-08-29 17:22:20', NULL, NULL),
(14, 4, 'The overlooked and undertreated perils of premature ovarian insufficiency', 'Samantha F. Butts', 'Cleveland Clinic Journal of Medicine', '10.3949/ccjm.92gr.25056', 'https://www.ccjm.org/content/92/8/475', '<p>Premature ovarian insufficiency (POI) is loss of ovarian function before age 40. Genetic, autoimmune, and iatrogenic causes are well defined, but 90% of cases are idiopathic. POI prevalence is estimated to be between 3% and 4%, with many cases undiagnosed or untreated. Affected individuals experience prolonged estrogen deficiency unless hormone therapy is instituted to restore physiologic levels. Untreated POI is associated with multiple health risks, including premature death due to cardiovascular disease.</p>', '2025-08-29', NULL, '[]', '2025-08-29 18:44:47', '2025-09-02 14:34:00', '1756823640291.pdf', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20250829122635-add_profile_fields_to_users.js'),
('20250901161956-add_article_fields.js'),
('20250902163139-add_article_fields.js');

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
  `department_institution` varchar(500) DEFAULT NULL,
  `biography_overview` text,
  `profile_image` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `bio` text,
  `university` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `program` varchar(255) DEFAULT NULL,
  `year_of_study` varchar(50) DEFAULT NULL,
  `research_area` varchar(255) DEFAULT NULL,
  `research_interests` text,
  `publications` text,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `google_scholar_url` varchar(255) DEFAULT NULL,
  `orcid_id` varchar(50) DEFAULT NULL,
  `skills` text,
  `phone_number` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `plan`, `department_institution`, `biography_overview`, `profile_image`, `gender`, `bio`, `university`, `department`, `program`, `year_of_study`, `research_area`, `research_interests`, `publications`, `linkedin_url`, `google_scholar_url`, `orcid_id`, `skills`, `phone_number`, `createdAt`, `updatedAt`) VALUES
(2, 'Ansh', 'ansh@itfosters.com', '$2b$10$eUz8.pnfDfuYPisUY2OUGOdQQc.dyq/Ba7WwHNZo8QtUdxX0Fq6Y2', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-29 14:57:13', '2025-08-29 14:57:13'),
(3, 'Deepak', 'deepak@itfosters.com', '$2b$10$xLoKZ9/HpJf8F1tCcj.Wre1VXUTVzQiUo8Jq3BSbp.t6ggr7NGIFK', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-29 14:57:13', '2025-08-29 14:57:13'),
(4, 'Ansh Kumar Pandey', 'ansh@gmailnew.com', '$2b$10$ZQAu1KSeejyIRGonfdA8l.XdhneeJEPvzZj8uwwKt70nT5y1RlIau', 'free', NULL, NULL, NULL, 'Male', '', '', '', '', '', '', '', '', '', '', '', '', '', '2025-08-29 14:57:13', '2025-09-02 14:31:19'),
(5, 'Madhu', 'madhu@itfosters.com', '$2b$10$XYQFNxDBqIB/9vLDwjZm/em.JTVHWweDG59DbU9jVxisZ1kJNN9GO', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-29 14:57:13', '2025-08-29 14:57:13'),
(6, 'new', 'new@gmail.com', '$2b$10$oceuTObVmR5OMzb0Y17K3uVCHgc9RD6SBiRyOoHOINHRL5z5wfG2O', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-29 14:57:13', '2025-08-29 14:57:13'),
(7, 'Ameer', 'Ameer@itfosters.com', '$2b$10$ocjQx68TcSW.gUOdkiw0MeHLPlX.nwIfQC1FGRl84YYThxGer8ZXm', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-29 14:57:13', '2025-08-29 14:57:13'),
(8, 'Munna Kumar', 'munna@itfosters.com', '$2b$10$awNWPvwTi66Zw8sA.8h4XOMDY5.LTy5a18WEmj9wLXMmUEO7FbhS2', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-29 14:57:13', '2025-08-29 14:57:13'),
(9, 'testnew', 'testnew@gmail.com', '$2b$10$yBirg42XskL94kbmbNsP4ORBSvvtnCPKVUrjkGXTk.OEWKQhZkt7W', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-29 16:58:12', '2025-08-29 16:58:12'),
(10, 'Developer', 'developer@gmail.com', '$2b$10$D1q6jytg8nrpRk6aF5xBAel6jeVOfxMKWEkhiuxd8DC04bGT3QLgq', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-03 10:16:11', '2025-09-03 10:16:11');

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
