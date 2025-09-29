-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 24, 2025 at 12:54 AM
-- Server version: 10.11.14-MariaDB
-- PHP Version: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `researchlocker_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `title` varchar(500) NOT NULL,
  `authors` varchar(500) DEFAULT NULL,
  `journal` varchar(255) DEFAULT NULL,
  `doi` varchar(255) DEFAULT NULL,
  `url` text NOT NULL,
  `purchaseDate` date DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `hashtags` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `summary` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `userId`, `title`, `authors`, `journal`, `doi`, `url`, `purchaseDate`, `price`, `tags`, `hashtags`, `createdAt`, `updatedAt`, `file_name`, `summary`) VALUES
(6, 7, 'Prediction of Cardiovascular and Renal Complications of Diabetes by a multi-Polygenic Risk Score in Different Ethnic Groups', 'Edoh Kodji, Redha Attaoua, Mounsif Haloui, Camil Hishmih, Mirjam Seitz, Pavel Hamet, Julie Hussin, Johanne Tremblay', 'medRxiv', '10.1101/2025.06.17.25329804', 'https://www.medrxiv.org/content/10.1101/2025.06.17.25329804v1', '2025-08-28', NULL, '[]', NULL, '2025-08-28 18:48:13', '2025-08-28 18:48:13', NULL, NULL),
(7, 7, 'Prediction of Cardiovascular and Renal Complications of Diabetes by a multi-Polygenic Risk Score in Different Ethnic Groups', 'Edoh Kodji, Redha Attaoua, Mounsif Haloui, Camil Hishmih, Mirjam Seitz, Pavel Hamet, Julie Hussin, Johanne Tremblay', 'medRxiv', '10.1101/2025.06.17.25329804', 'https://www.medrxiv.org/content/10.1101/2025.06.17.25329804v1', '2025-08-28', NULL, '[]', NULL, '2025-08-28 18:48:40', '2025-08-28 18:48:40', NULL, NULL),
(25, 14, 'Cancel culture in a developing country: A belief in a just world behavioral analysis among generation Z', 'Cheselle Jan L. Roldan a b , Ardvin Kester S. Ong a c ,  Dhonn Q. Tomas c', 'Acta Psychologica', '10.1016/j.actpsy.2024.104378', 'https://www.sciencedirect.com/science/article/pii/S0001691824002555', '2025-09-07', NULL, '[]', NULL, '2025-09-07 08:24:54', '2025-09-07 08:24:54', NULL, NULL),
(26, 14, 'Revisiting Cancel Culture - Ryan SC Wong, 2022', 'Ryan SC Wong', 'Contexts', '10.1177/15365042221131087', 'https://journals.sagepub.com/doi/full/10.1177/15365042221131087', '2025-09-07', NULL, '[]', NULL, '2025-09-07 08:26:18', '2025-09-07 08:26:18', NULL, NULL),
(27, 14, 'Cancer statistics, 2025', 'Rebecca L Siegel 1, Tyler B Kratzer 1, Angela N Giaquinto 1, Hyuna Sung 1, Ahmedin Jemal', 'CA: a cancer journal for clinicians', '10.3322/caac.21871', 'https://pubmed.ncbi.nlm.nih.gov/39817679/', '2025-09-07', NULL, '[]', NULL, '2025-09-07 08:28:23', '2025-09-07 08:28:23', NULL, NULL),
(28, 14, 'Cancer statistics, 2025', 'Rebecca L. Siegel, Tyler B. Kratzer, Angela N. Giaquinto, Hyuna Sung, Ahmedin Jemal', 'CA: A Cancer Journal for Clinicians', '10.3322/caac.21871', 'https://acsjournals.onlinelibrary.wiley.com/doi/10.3322/caac.21871', '2025-09-07', NULL, '[]', NULL, '2025-09-07 08:28:32', '2025-09-07 08:28:32', NULL, NULL),
(29, 14, 'Detection of Cancers Three Years prior to Diagnosis Using Plasma Cell-Free DNA', 'Wang, Yuxuan, Joshu, Corinne E., Curtis, Samuel D., Douville, Christopher, Burk, Vernon A., Ru, Meng, Popoli, Maria, Ptak, Janine, Dobbyn, Lisa, Silliman, Natalie, Coresh, Josef, Boerwinkle, Eric, Prizment, Anna, Bettegowda, Chetan, Kinzler, Kenneth W., Papadopoulos, Nickolas, Platz, Elizabeth A., Vogelstein, Bert', 'Cancer Discovery', '10.1158/2159-8290.CD-25-0375', 'https://aacrjournals.org/cancerdiscovery/article-abstract/15/9/1794/764359/Detection-of-Cancers-Three-Years-prior-to?redirectedFrom=fulltext', '2025-09-07', NULL, '[]', NULL, '2025-09-07 08:30:47', '2025-09-07 08:30:47', NULL, NULL),
(30, 14, 'Detection of Cancers Three Years prior to Diagnosis Using Plasma Cell-Free DNA', 'Wang, Yuxuan, Joshu, Corinne E., Curtis, Samuel D., Douville, Christopher, Burk, Vernon A., Ru, Meng, Popoli, Maria, Ptak, Janine, Dobbyn, Lisa, Silliman, Natalie, Coresh, Josef, Boerwinkle, Eric, Prizment, Anna, Bettegowda, Chetan, Kinzler, Kenneth W., Papadopoulos, Nickolas, Platz, Elizabeth A., Vogelstein, Bert', 'Cancer Discovery', '10.1158/2159-8290.CD-25-0375', 'https://aacrjournals.org/cancerdiscovery/article-abstract/15/9/1794/764359/Detection-of-Cancers-Three-Years-prior-to?redirectedFrom=fulltext', '2025-09-07', NULL, '[]', NULL, '2025-09-07 09:10:52', '2025-09-07 09:10:52', NULL, NULL),
(42, 20, 'A systematic review of physical therapy rehabilitation for stroke survivors in Arab countries and Saudi Arabia: current approaches and future challenges', 'Abdullah I. Alhusayni and Abdullah H. Alzahrani', NULL, 'https://doi.org/10.15537/smj.2025.46.9.20250255', 'https://smj.org.sa/content/46/9/976', NULL, NULL, NULL, NULL, '2025-09-08 14:50:07', '2025-09-08 14:50:07', NULL, NULL),
(44, 12, 'Midterm outcomes of rheumatic mitral valve repair versus replacement in a dual-centre retrospective study', 'Songhao Jia, Peiyi Liu, Maozhou Wang, Xiaohan Zhong, Meili Wang, Wei Luo, Yuyong Liu, Hongyu Ye, Hongjia Zhang, Wenjian Jiang', 'Heart', '10.1136/heartjnl-2025-326323', 'https://heart.bmj.com/content/early/2025/09/05/heartjnl-2025-326323', '2025-09-09', NULL, '[]', NULL, '2025-09-09 10:06:21', '2025-09-09 10:06:21', NULL, NULL),
(45, 12, 'Clinical predictors and prognostic impact of left ventricular thrombus recurrence', 'Aloysius Sheng-Ting Leow, Christopher Junyan Low, Fang-Qin Goh, Andre Wen-Jie Seah, Benjamin Yong-Qiang Tan, William K F Kong, Kian-Keong Poh, Mark Y Chan, Leonard L L Yeo, Ping Chai, Tiong-Cheng Yeo, Xin Zhou, Gregory Y H Lip, Ching-Hui Sia, rahul', 'Heart', '10.1136/heartjnl-2025-326486', 'https://heart.bmj.com/content/early/2025/09/08/heartjnl-2025-326486', '2025-09-09', NULL, '[]', NULL, '2025-09-09 10:06:50', '2025-09-09 14:14:10', NULL, NULL),
(47, 12, 'Breath versus saliva for lung cancer detection with dogs', 'Margaret A. Crawford, Catherina L. Chang, Clare M. Browne, Sandra Hopping, Michael B. Jameson, Timothy L. Edwards', 'ERJ Open Research', '10.1183/23120541.00914-2024', 'https://publications.ersnet.org/content/erjor/11/5/00914-2024', '2025-09-09', NULL, '[]', '#LungCancerDetection #CanineScentDetection #BreathSamples #SalivaSamples #ComparativeUtility #VolatileOrganicCompoundsVocs #EarlyDetection #NoninvasiveScreening #Sensitivity #Specificity #AutomatedApparatus #DiagnosticTechnology #Biomarkers #SampleCollection #Accuracy', '2025-09-09 19:05:50', '2025-09-09 19:07:54', '1757444835095.pdf', '<p> Detailed Summary with Key Points</p><p>1. **Background &amp; Motivation**</p><p> * Lung cancer is the leading cause of cancer-related deaths globally, frequently detected late when curative treatment is no longer possible.</p><p> * Current early detection methods are costly or limited, motivating the search for fast, cost-effective, and non-invasive volatile organic compound (VOC) analysis using animals.</p><p>2. **Key Findings**</p><p> * Dogs showed significantly higher detection of lung cancer-positive breath samples (mean 0.78, 95% CI 0.71–0.83) than positive saliva samples (mean 0.42, 95% CI 0.34–0.50; p&lt;0.001).</p><p> * There were no significant differences in the accuracy of classifying non-target samples between breath (mean 0.68) and saliva (mean 0.68; p=0.854).</p><p> * Overall, dogs detected lung cancer with greater accuracy using breath samples compared to saliva samples.</p><p>3. **Methods &amp; Evidence**</p><p> * Seven dogs assessed breath and saliva samples from 154 patients attending a general respiratory clinic.</p><p> * Dogs were trained using an automated apparatus to identify samples from patients later diagnosed with lung cancer, and sensitivity and specificity measured their performance.</p><p>4. **Therapeutic Implications**</p><p> * The study suggests that breath samples have greater utility for canine scent detection of lung cancer due to higher sensitivity.</p><p> * While breath samples are preferred for volatile-based lung cancer detection, saliva samples may still be useful with further methodological improvements.</p><p>5. **Conclusion**</p><p> * Dogs demonstrated superior accuracy in detecting lung cancer using breath samples compared to saliva samples.</p><p> * Breath samples are likely the better choice for volatile-based diagnostic technology, though saliva samples could play a role with advancements.</p>'),
(48, 12, 'Sustainability Matters: Company SDG Scores Need Not Have Size, Location, and ESG Disclosure Biases', 'Lewei He, Harald Lohre, Jan Anton van Zanten', 'The Journal of Impact and ESG Investing', '10.3905/jesg.2025.1.133', 'https://www.pm-research.com/content/pmrjesg/6/1/83', '2025-09-10', NULL, '[]', '#SdgScores #EsgRatings #SustainableDevelopmentGoalsSdgs #SizeBias #LocationBias #EsgDisclosureBiases #CorporateSustainabilityPerformance #SustainableInvestingStrategies #InvestmentPortfolios #EmergingMarkets #DevelopedMarkets #ResourcesForEsgDataDisclosureRpd #BiasAvoidance #ReliabilityConcerns #GreenwashingConcerns', '2025-09-10 17:45:36', '2025-09-10 17:47:45', '1757526449586.pdf', '• Detailed Summary with Key Points\n1.  **Background & Motivation**\n    *   Sustainable investors increasingly align strategies with the 17 UN Sustainable Development Goals (SDGs), requiring unbiased metrics to assess corporate alignment.\n    *   Existing ESG ratings are known to exhibit biases related to company size, location, and disclosure capacity, raising concerns about their reliability for corporate sustainability.\n2.  **Key Findings**\n    *   Company SDG scores need not be influenced by a company’s size, its location, or its resources for ESG data disclosure.\n    *   These results contrast with ESG ratings, which are widely recognized to have significant size, location, and disclosure biases.\n    *   The study found an economically insignificant negative correlation between company size and SDG scores, with firms in emerging markets showing marginally higher SDG alignment.\n3.  **Methods & Evidence**\n    *   The study analyzed SDG scores from Robeco, one of the first providers in the market, and utilized MSCI SDG scores for robust cross-validation.\n    *   Researchers specifically tested for biases related to company size, geographic location (developed versus emerging markets), and resources devoted to ESG data disclosure (RPD).\n4.  **Practical Implications**\n    *   SDG-aligned investment portfolios can effectively avoid common biases associated with traditional sustainability ratings, offering more accurate impact assessments.\n    *   The results challenge the conventional belief that company size, geographic location, or disclosure resources are primary determinants of corporate sustainability performance.\n5.  **Conclusion**\n    *   The findings demonstrate that SDG scores provide a less biased and more robust measure of corporate sustainability impact compared to ESG ratings.\n    *   This allows investors to construct more genuinely sustainable portfolios without the common distortions found in ESG ratings.'),
(49, 12, 'Exploring the voices of children and young people in relation to emotionally based school non-attendance', 'Lisa Musenga-Grant, Kirstie MacFarland, Alison White', 'Educational and Child Psychology', '10.53841/bpsecp.2025.42.2.5', 'https://explore.bps.org.uk/content/bpsecp/42/2/5', '2025-09-10', NULL, '[]', NULL, '2025-09-10 17:48:57', '2025-09-10 17:48:57', NULL, NULL),
(50, 12, 'Forging metal oxalates from carbon dioxide as precursors to sustainable cement production', 'AccessScience Editors', '', '10.1036/1097-8542.aBR2506181', 'https://www.accessscience.com/content/briefing/aBR2506181', '2025-09-10', NULL, '[]', NULL, '2025-09-10 17:52:04', '2025-09-10 17:52:04', NULL, NULL),
(51, 12, 'Support Transgender and Nonbinary Children and Adolescents: Condemning the Traumatizing Statements of the U.S. White House’s Proclamation', 'Steven A. John, Ryan L. Rahm-Knigge, Ben C. D. Weideman, Transforming Families, Rhea Alley, Dianne R. Berg, Michael G. Curtis, Hana-May Eadeh, Jamie L. Feldman, Amy L. Gower, Owen P. Karcher, J.J. Koechell, Carrie Link, Kene Orakwue, Elizabeth Panetta, Benjamin Parchem, Lauren Love Pieczykolan, Jonathan L. Poquiz, Courtney A. Sarkin, Kay Simon, Katherine G. Spencer, G. Nic Rider, Michael B. Jameson', 'Annals of LGBTQ Public and Population Health', '10.1891/LGBTQ-2025-0007', 'https://connect.springerpub.com/content/sgrlgbtq/6/2/119', '2025-09-10', NULL, '[]', NULL, '2025-09-10 17:52:15', '2025-09-16 17:35:59', NULL, NULL),
(52, 12, 'Respiratory syncytial virus (RSV)', 'Shors, Teri', '', '10.1036/1097-8542.583550', 'https://www.accessscience.com/content/article/a583550', '2025-09-10', NULL, '[]', NULL, '2025-09-10 17:52:56', '2025-09-10 17:52:56', NULL, NULL),
(56, 31, 'Facing a smear test after my trauma', 'Ruth Ajayi', NULL, '10.1136/bmj.r1439', 'https://www.bmj.com/content/390/bmj.r1439', NULL, NULL, NULL, NULL, '2025-09-16 17:11:54', '2025-09-16 17:11:54', NULL, NULL),
(57, 12, 'Effect of ketone supplementation, a low-carbohydrate diet and a ketogenic diet on heart failure measures and outcomes: a systematic review and meta-analysis', 'Lee P Liao, Lauren Adriel Church, Hannah Melville, Thilini Jayasinghe, Carina Choy, Aileen Zeng, Nikki Barrett, Simone Marschner, Gary Chieh Howe Gan, Liza Thomas, Sarah Zaman', 'Heart', '10.1136/heartjnl-2025-326082', 'https://heart.bmj.com/content/early/2025/09/16/heartjnl-2025-326082', '2025-09-16', NULL, '[]', '#KetoneSupplementation #LowcarbohydrateDiet #KetogenicDiet #HeartFailureHf #SystematicReview #Metaanalysis #CardiacFunction #HeartFailureWithReducedEjectionFractionHfref #LeftVentricularEjectionFractionLvef #CardiacOutput #MetabolicModulation #Hydroxybutyrate #RandomisedControlledTrials', '2025-09-16 17:29:35', '2025-09-16 17:31:40', '1758043864725.pdf', '• Detailed Summary with Key Points\n1.  **Background & Motivation**\n    *   Heart failure affects over 56 million people globally, with the failing heart increasingly relying on ketones for energy.\n    *   This systematic review and meta-analysis investigated the largely unknown impact of ketone supplementation, low-carbohydrate, and ketogenic diets on cardiac function and heart failure outcomes.\n2.  **Key Findings**\n    *   A meta-analysis of six randomized controlled trials showed ketone supplementation increased left ventricular ejection fraction by 3.12% (95% CI 0.95% to 5.30%, p<0.01).\n    *   This improvement was more pronounced in patients with heart failure with reduced ejection fraction (HFrEF), showing a 4.25% increase (95% CI 1.99% to 6.51%, p<0.001).\n    *   For HFrEF patients, ketone supplementation also significantly increased peak systolic annular velocity by 0.60% (95% CI 0.17% to 1.02%, p<0.01) and cardiac output by 1.24 L/min (95% CI 0.24 to 2.24, p<0.05).\n    *   Meta-analysis for low-carbohydrate or ketogenic diets could not be performed due to low study numbers, resulting in a low to high certainty assessment overall.\n3.  **Methods & Evidence**\n    *   Researchers conducted a systematic review and meta-analysis, searching MEDLINE, Embase, CINAHL, and Web of Science for RCTs and observational studies in humans.\n    *   Out of 14 included studies, a meta-analysis was performed on six randomized controlled trials reporting cardiac function or heart failure measures.\n4.  **Therapeutic Implications**\n    *   Ketone supplementation appears to be a promising therapeutic option for improving cardiac function, particularly for individuals with HFrEF.\n    *   Further larger-scale research is warranted to fully understand the effects of low-carbohydrate and ketogenic diets on heart failure outcomes.\n5.  **Conclusion**\n    *   Ketone supplementation significantly enhanced cardiac function compared to controls, especially in patients with heart failure with reduced ejection fraction.\n    *   Additional rigorous research is essential to elucidate the impact of low carbohydrate and ketogenic diets on heart failure outcomes.'),
(58, 12, 'Revascularisation strategies for non-acute myocardial ischaemic syndromes', 'Michal J Kawczynski, Fabio Barili, James M Brophy, Raffaele De Caterina, Giuseppe Biondi Zoccai, Amedeo Anselmi, William E Boden, Alessandro Parolari, Samuel Heuts', 'Heart', '10.1136/heartjnl-2025-326101', 'https://heart.bmj.com/content/early/2025/09/14/heartjnl-2025-326101', '2025-09-16', NULL, '[]', NULL, '2025-09-16 17:30:27', '2025-09-16 17:30:27', NULL, NULL),
(59, 31, 'Living with an intolerance to medication', 'Steven Comyns', 'BMJ', '10.1136/bmj.r1288', 'https://www.bmj.com/content/390/bmj.r1288', '2025-09-16', NULL, '[]', NULL, '2025-09-16 17:52:16', '2025-09-16 17:52:16', NULL, NULL),
(60, 31, 'Living in a prison with no bars', 'Raymond Kay', 'BMJ', '10.1136/bmj.r1112', 'https://www.bmj.com/content/389/bmj.r1112', '2025-09-16', NULL, '[]', NULL, '2025-09-16 17:52:48', '2025-09-16 17:56:02', NULL, '<p>;fklsalkaksjlkasd</p>'),
(61, 25, 'Ansh ', 'Ansh', NULL, '77889944', 'https://ansh.com', NULL, NULL, NULL, '#DatabaseManagementSystemLab #DdlCommands #CreateTable #AlterTable #AddPrimaryKey #ModifyDatatype #ModifyColumnSize #AddColumn #RenameColumn #DropColumn #RenameTable #TableSchemaDefinition #SqlOperations #DataTypeManagement', '2025-09-17 15:14:54', '2025-09-17 15:15:35', '1758122102525.pdf', '• Detailed Summary with Key Points\n1.  **Background & Motivation**\n    *   This document presents Practical No. 01 for the B.Tech Semester-V Database Management System Lab (BCS-551) for the session 2025-26.\n    *   The practical aims to demonstrate and apply various Data Definition Language (DDL) commands in SQL.\n2.  **Key Findings**\n    *   A table named `Aman` was successfully created with seven columns including `Roll_No` (integer) and `Name` (char(25)).\n    *   The `Aman` table was altered to add `Roll_No` as a primary key and modify `Ph_No` to `NUMBER(38)` and `Address` to `VARCHAR2(70)`.\n    *   Additional `ALTER TABLE` commands successfully added an `Email` column, renamed `Roll_No` to `Enrollment_No`, and dropped the `F_Name` column.\n    *   The table `Aman` was successfully renamed to `Aman123` through a specific DDL command.\n3.  **Methods & Evidence**\n    *   The methodology involved executing specific SQL DDL commands in a database environment.\n    *   Evidence of successful command execution is provided by the output schema, showing the updated table structure after each operation.\n4.  **Practical Implications**\n    *   This practical demonstrates fundamental database administration skills required for defining and modifying database schemas.\n    *   Mastery of DDL commands is essential for effective database design, data integrity, and adapting to evolving data storage needs.\n5.  **Conclusion**\n    *   The lab successfully illustrated the core functionalities of DDL commands in creating, altering, and renaming database table components.\n    *   It showcased the practical application of SQL DDL operations for managing and evolving database structures.');

-- --------------------------------------------------------

--
-- Table structure for table `article_authors`
--

CREATE TABLE `article_authors` (
  `article_id` int(11) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `article_authors`
--

INSERT INTO `article_authors` (`article_id`, `author_id`) VALUES
(47, 1),
(47, 2),
(47, 3),
(47, 4),
(47, 5),
(47, 6),
(48, 7),
(48, 8),
(48, 9),
(49, 10),
(49, 11),
(49, 12),
(50, 13),
(51, 5),
(51, 14),
(51, 15),
(51, 16),
(51, 17),
(51, 18),
(51, 19),
(51, 20),
(51, 21),
(51, 22),
(51, 23),
(51, 24),
(51, 25),
(51, 26),
(51, 27),
(51, 28),
(51, 29),
(51, 30),
(51, 31),
(51, 32),
(51, 33),
(51, 34),
(51, 35),
(52, 36),
(52, 37),
(56, 52),
(57, 53),
(57, 54),
(57, 55),
(57, 56),
(57, 57),
(57, 58),
(57, 59),
(57, 60),
(57, 61),
(57, 62),
(57, 63),
(58, 64),
(58, 65),
(58, 66),
(58, 67),
(58, 68),
(58, 69),
(58, 70),
(58, 71),
(58, 72),
(59, 73),
(60, 74),
(61, 75);

-- --------------------------------------------------------

--
-- Table structure for table `article_tags`
--

CREATE TABLE `article_tags` (
  `article_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `article_tags`
--

INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES
(47, 1),
(47, 2),
(47, 3),
(47, 4),
(47, 5),
(47, 6),
(47, 7),
(47, 8),
(47, 9),
(47, 10),
(47, 11),
(47, 12),
(47, 13),
(47, 14),
(47, 15),
(48, 16),
(48, 17),
(48, 18),
(48, 19),
(48, 20),
(48, 21),
(48, 22),
(48, 23),
(48, 24),
(48, 25),
(48, 26),
(48, 27),
(48, 28),
(48, 29),
(48, 30),
(57, 76),
(57, 77),
(57, 78),
(57, 79),
(57, 80),
(57, 81),
(57, 82),
(57, 83),
(57, 84),
(57, 85),
(57, 86),
(57, 87),
(57, 88),
(61, 89),
(61, 90),
(61, 91),
(61, 92),
(61, 93),
(61, 94),
(61, 95),
(61, 96),
(61, 97),
(61, 98),
(61, 99),
(61, 100),
(61, 101),
(61, 102);

-- --------------------------------------------------------

--
-- Table structure for table `authors`
--

CREATE TABLE `authors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `authors`
--

INSERT INTO `authors` (`id`, `name`) VALUES
(51, '3ssze'),
(13, 'AccessScience Editors'),
(58, 'Aileen Zeng'),
(71, 'Alessandro Parolari'),
(12, 'Alison White'),
(50, 'Allowen Evin'),
(69, 'Amedeo Anselmi'),
(23, 'Amy L. Gower'),
(46, 'Angele Jeanty'),
(75, 'Ansh'),
(16, 'Ben C. D. Weideman'),
(29, 'Benjamin Parchem'),
(43, 'Camille Dham'),
(57, 'Carina Choy'),
(26, 'Carrie Link'),
(2, 'Catherina L. Chang'),
(3, 'Clare M. Browne'),
(47, 'Clemence Pagnoux'),
(32, 'Courtney A. Sarkin'),
(19, 'Dianne R. Berg'),
(28, 'Elizabeth Panetta'),
(65, 'Fabio Barili'),
(35, 'G. Nic Rider'),
(61, 'Gary Chieh Howe Gan'),
(68, 'Giuseppe Biondi Zoccai'),
(21, 'Hana-May Eadeh'),
(55, 'Hannah Melville'),
(8, 'Harald Lohre'),
(25, 'J.J. Koechell'),
(66, 'James M Brophy'),
(22, 'Jamie L. Feldman'),
(9, 'Jan Anton van Zanten'),
(49, 'Jean-Frederic Terral'),
(31, 'Jonathan L. Poquiz'),
(42, 'Julien Claude'),
(34, 'Katherine G. Spencer'),
(39, 'Katie Anne Haerling'),
(33, 'Kay Simon'),
(27, 'Kene Orakwue'),
(11, 'Kirstie MacFarland'),
(54, 'Lauren Adriel Church'),
(30, 'Lauren Love Pieczykolan'),
(41, 'Laurent Bouby'),
(53, 'Lee P Liao'),
(7, 'Lewei He'),
(10, 'Lisa Musenga-Grant'),
(62, 'Liza Thomas'),
(1, 'Margaret A. Crawford'),
(5, 'Michael B. Jameson'),
(20, 'Michael G. Curtis'),
(64, 'Michal J Kawczynski'),
(44, 'Muriel Gros-Balthazard'),
(59, 'Nikki Barrett'),
(24, 'Owen P. Karcher'),
(67, 'Raffaele De Caterina'),
(74, 'Raymond Kay'),
(18, 'Rhea Alley'),
(52, 'Ruth Ajayi'),
(15, 'Ryan L. Rahm-Knigge'),
(72, 'Samuel Heuts'),
(4, 'Sandra Hopping'),
(45, 'Sarah Ivorra'),
(63, 'Sarah Zaman'),
(36, 'Shors'),
(60, 'Simone Marschner'),
(14, 'Steven A. John'),
(73, 'Steven Comyns'),
(38, 'Susan Prion'),
(37, 'Teri'),
(48, 'Thierry Pastor'),
(56, 'Thilini Jayasinghe'),
(6, 'Timothy L. Edwards'),
(17, 'Transforming Families'),
(40, 'Vincent Bonhomme'),
(70, 'William E Boden');

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `collection_name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `collections`
--

INSERT INTO `collections` (`id`, `userId`, `collection_name`, `createdAt`, `updatedAt`) VALUES
(1, 20, 'My_Fav', '2025-09-16 19:15:23', '2025-09-16 19:15:23');

-- --------------------------------------------------------

--
-- Table structure for table `collection_masters`
--

CREATE TABLE `collection_masters` (
  `id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `collection_masters`
--

INSERT INTO `collection_masters` (`id`, `collection_id`, `article_id`, `createdAt`, `updatedAt`) VALUES
(1, 1, 42, '2025-09-16 19:15:44', '2025-09-16 19:15:44');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `article_limit` int(11) DEFAULT 0,
  `price` decimal(10,2) NOT NULL,
  `duration_days` int(11) DEFAULT 0,
  `features` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `name`, `article_limit`, `price`, `duration_days`, `features`) VALUES
(1, 'Free', 10, 0.00, 0, 'Save up to 10 articles'),
(2, 'Pro', 0, 9.99, 365, 'Unlimited articles, AI summaries, 1-year access');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
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
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(15, 'Accuracy'),
(61, 'AcuteMyocardialInfarctionMi'),
(96, 'AddColumn'),
(93, 'AddPrimaryKey'),
(47, 'Algorithms'),
(70, 'AllcauseDeath'),
(92, 'AlterTable'),
(33, 'Archaeobotany'),
(39, 'ArchaeologicalFruitsAndSeeds'),
(49, 'AsymptoticNotations'),
(11, 'AutomatedApparatus'),
(66, 'BenefitriskAssessment'),
(28, 'BiasAvoidance'),
(51, 'BinaryTrees'),
(13, 'Biomarkers'),
(3, 'BreathSamples'),
(2, 'CanineScentDetection'),
(82, 'CardiacFunction'),
(85, 'CardiacOutput'),
(64, 'ClearTrial'),
(62, 'Colchicine'),
(60, 'CollisionResolutionTechniques'),
(44, 'ComparativePerformance'),
(5, 'ComparativeUtility'),
(31, 'ConvolutionalNeuralNetworks'),
(22, 'CorporateSustainabilityPerformance'),
(48, 'CProgram'),
(91, 'CreateTable'),
(89, 'DatabaseManagementSystemLab'),
(46, 'DataStructures'),
(102, 'DataTypeManagement'),
(90, 'DdlCommands'),
(36, 'DeepLearning'),
(26, 'DevelopedMarkets'),
(12, 'DiagnosticTechnology'),
(72, 'Diarrhoea'),
(34, 'DomesticationStudies'),
(98, 'DropColumn'),
(7, 'EarlyDetection'),
(32, 'EllipticalFourierTransforms'),
(25, 'EmergingMarkets'),
(21, 'EsgDisclosureBiases'),
(17, 'EsgRatings'),
(65, 'GeneralisedPairwiseComparisonsGpc'),
(35, 'GeometricMorphometrics'),
(52, 'Graphs'),
(57, 'GraphTraversal'),
(30, 'GreenwashingConcerns'),
(74, 'Gynaecomastia'),
(79, 'HeartFailureHf'),
(83, 'HeartFailureWithReducedEjectionFractionHfref'),
(42, 'HumanplantRelationships'),
(87, 'Hydroxybutyrate'),
(73, 'Hyperkalaemia'),
(24, 'InvestmentPortfolios'),
(78, 'KetogenicDiet'),
(76, 'KetoneSupplementation'),
(84, 'LeftVentricularEjectionFractionLvef'),
(53, 'LinkedLists'),
(20, 'LocationBias'),
(77, 'LowcarbohydrateDiet'),
(1, 'LungCancerDetection'),
(81, 'Metaanalysis'),
(86, 'MetabolicModulation'),
(95, 'ModifyColumnSize'),
(94, 'ModifyDatatype'),
(43, 'MorphologicalIdentification'),
(54, 'MultidimensionalArrays'),
(8, 'NoninvasiveScreening'),
(38, 'OutlineAnalyses'),
(40, 'PlantTaxaIdentification'),
(59, 'Polynomials'),
(69, 'PostmiPatients'),
(50, 'Queues'),
(68, 'RandomisedControlledTrial'),
(88, 'RandomisedControlledTrials'),
(71, 'RecurrentMi'),
(56, 'Recursion'),
(29, 'ReliabilityConcerns'),
(97, 'RenameColumn'),
(99, 'RenameTable'),
(27, 'ResourcesForEsgDataDisclosureRpd'),
(4, 'SalivaSamples'),
(14, 'SampleCollection'),
(45, 'SampleSize'),
(16, 'SdgScores'),
(9, 'Sensitivity'),
(58, 'ShortestPathAlgorithms'),
(19, 'SizeBias'),
(55, 'SortingAlgorithms'),
(10, 'Specificity'),
(63, 'Spironolactone'),
(101, 'SqlOperations'),
(37, 'SubspecificIdentification'),
(18, 'SustainableDevelopmentGoalsSdgs'),
(23, 'SustainableInvestingStrategies'),
(80, 'SystematicReview'),
(100, 'TableSchemaDefinition'),
(75, 'UnplannedIschaemiadrivenRevascularisation'),
(6, 'VolatileOrganicCompoundsVocs'),
(41, 'WildAndDomesticatedTypes'),
(67, 'WinRatio');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(160) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `plan` enum('free','pro') DEFAULT 'free',
  `profile_image` varchar(255) DEFAULT '',
  `gender` enum('Male','Female','Other') DEFAULT 'Other',
  `bio` text DEFAULT NULL,
  `university` varchar(255) DEFAULT '',
  `department` varchar(255) DEFAULT '',
  `program` varchar(255) DEFAULT '',
  `year_of_study` varchar(50) DEFAULT '',
  `research_area` text DEFAULT NULL,
  `research_interests` text DEFAULT NULL,
  `publications` text DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT '',
  `google_scholar_url` varchar(255) DEFAULT '',
  `orcid_id` varchar(50) DEFAULT '',
  `skills` text DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `twitterId` varchar(255) DEFAULT NULL,
  `twitterToken` varchar(255) DEFAULT NULL,
  `twitterTokenSecret` varchar(255) DEFAULT NULL,
  `linkedinId` varchar(255) DEFAULT NULL,
  `linkedinToken` varchar(255) DEFAULT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `plan`, `profile_image`, `gender`, `bio`, `university`, `department`, `program`, `year_of_study`, `research_area`, `research_interests`, `publications`, `linkedin_url`, `google_scholar_url`, `orcid_id`, `skills`, `phone_number`, `createdAt`, `twitterId`, `twitterToken`, `twitterTokenSecret`, `linkedinId`, `linkedinToken`, `updatedAt`) VALUES
(7, 'Ameer', 'Ameer@itfosters.com', '$2b$10$ocjQx68TcSW.gUOdkiw0MeHLPlX.nwIfQC1FGRl84YYThxGer8ZXm', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-29 14:57:13', NULL, NULL, NULL, NULL, NULL, '2025-08-29 14:57:13'),
(12, 'Ranu Kumar', 'ranu@itfosters.com', '$2b$12$A1ZB4q4QiY3uav1CRELyZuH7yf86mYXRbRHTrqPiOKrkIw0Fjk53W', 'free', '12-1757527758749-800513521.jpg', 'Male', 'Thank you for test', 'yelle university', 'New Delhi', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'cancer star', NULL, '2025-09-04 17:53:50', NULL, NULL, NULL, NULL, NULL, '2025-09-17 16:08:19'),
(14, 'Madhu Kumari', 'madhu@gmail.com', '$2b$10$E7s.FWAEsFshImespt3FPePrnj1.TD7qxWESZp7jL3bBtZkziMXZq', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-07 08:24:05', NULL, NULL, NULL, NULL, NULL, '2025-09-07 08:24:05'),
(18, 'Smarth Gupta', 'smarthgupta03@gmail.com', '$2b$10$gVC0QuRXIW7I.ZPT2qRoQOusC9DMmZxdipPp0mtMlTE5MzPYdCx9W', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 13:45:49', NULL, NULL, NULL, NULL, NULL, '2025-09-08 13:45:49'),
(19, 'Anand Thakur', 'anandthakur4138d@gmail.com', '$2b$10$cWJasIMhYSmBEUphM0fwhuqQfmXdHHBXERVpvCVfHJYh3YUrxY4IK', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 14:28:40', NULL, NULL, NULL, NULL, NULL, '2025-09-08 14:28:40'),
(20, 'Ameer Subhani', 'ameersubhani92@gmail.com', '$2b$10$g4Yx5zRlj4HoRQIv2dnKk.gYZu52QgQr6eNoHpmdinPqYNkxcJNAa', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-08 14:31:14', NULL, NULL, NULL, NULL, NULL, '2025-09-08 14:31:14'),
(25, 'Ansh Pandey', 'anshpandey1807@gmail.com', '', 'free', '25-1758115802652-875902635.jpg', 'Other', '', '', '', '', '', '', '', '', '', '', '', '', '', '2025-09-11 16:18:23', NULL, NULL, NULL, NULL, NULL, '2025-09-17 13:30:02'),
(31, 'Vijay Nautiyal', 'nautiyal_vij@yahoo.com', '$2b$10$vgjUQB8i5sUwPmryGWUf1e22EKbLIpInuf6KZpsU0tVIvXPb7uBw6', 'free', '', 'Other', '', '', '', '', '', '', '', '', '', '', '', '', '', '2025-09-16 17:08:49', NULL, NULL, NULL, NULL, NULL, '2025-09-16 17:08:49'),
(33, 'Ali Vaqar', 'alivaqar9@gmail.com', '', 'free', '', 'Other', '', '', '', '', '', '', '', '', '', '', '', '', '', '2025-09-18 01:49:25', NULL, NULL, NULL, NULL, NULL, '2025-09-18 01:49:25');

-- --------------------------------------------------------

--
-- Table structure for table `user_plan`
--

CREATE TABLE `user_plan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `start_date` datetime DEFAULT current_timestamp(),
  `end_date` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_plan`
--

INSERT INTO `user_plan` (`id`, `user_id`, `plan_id`, `start_date`, `end_date`, `active`) VALUES
(2, 1, 2, '2025-09-05 10:59:48', '2026-09-05 10:59:48', 1),
(3, 12, 2, '2025-09-11 14:45:36', '2026-09-11 14:45:36', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_plans`
--

CREATE TABLE `user_plans` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `article_authors`
--
ALTER TABLE `article_authors`
  ADD UNIQUE KEY `article_authors_article_id_author_id` (`article_id`,`author_id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `article_tags`
--
ALTER TABLE `article_tags`
  ADD PRIMARY KEY (`article_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `authors`
--
ALTER TABLE `authors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `authors_name` (`name`);

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `collection_masters`
--
ALTER TABLE `collection_masters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `collection_masters_article_id_collection_id_unique` (`collection_id`,`article_id`),
  ADD UNIQUE KEY `unique_collection_article` (`collection_id`,`article_id`),
  ADD KEY `article_id` (`article_id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `name_20` (`name`),
  ADD UNIQUE KEY `name_21` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `twitterId` (`twitterId`),
  ADD UNIQUE KEY `linkedinId` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_2` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_2` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_3` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_3` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_4` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_4` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_5` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_5` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_6` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_6` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_7` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_7` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_8` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_8` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_9` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_9` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_10` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_10` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_11` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_11` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_12` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_12` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_13` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_13` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_14` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_14` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_15` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_15` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_16` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_16` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_17` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_17` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_18` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_18` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_19` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_19` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_20` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_20` (`linkedinId`),
  ADD UNIQUE KEY `twitterId_21` (`twitterId`),
  ADD UNIQUE KEY `linkedinId_21` (`linkedinId`);

--
-- Indexes for table `user_plan`
--
ALTER TABLE `user_plan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- Indexes for table `user_plans`
--
ALTER TABLE `user_plans`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `authors`
--
ALTER TABLE `authors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `collection_masters`
--
ALTER TABLE `collection_masters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `user_plan`
--
ALTER TABLE `user_plan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_plans`
--
ALTER TABLE `user_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `article_authors`
--
ALTER TABLE `article_authors`
  ADD CONSTRAINT `article_authors_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `article_authors_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `article_tags`
--
ALTER TABLE `article_tags`
  ADD CONSTRAINT `article_tags_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `article_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `collections`
--
ALTER TABLE `collections`
  ADD CONSTRAINT `collections_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `collection_masters`
--
ALTER TABLE `collection_masters`
  ADD CONSTRAINT `collection_masters_ibfk_39` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `collection_masters_ibfk_40` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
