-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 05, 2025 at 05:31 AM
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(14, 4, 'The overlooked and undertreated perils of premature ovarian insufficiency', 'Samantha F. Butts', 'Cleveland Clinic Journal of Medicine', '10.3949/ccjm.92gr.25056', 'https://www.ccjm.org/content/92/8/475', '<p>Premature ovarian insufficiency (POI) is loss of ovarian function before age 40. Genetic, autoimmune, and iatrogenic causes are well defined, but 90% of cases are idiopathic. POI prevalence is estimated to be between 3% and 4%, with many cases undiagnosed or untreated. Affected individuals experience prolonged estrogen deficiency unless hormone therapy is instituted to restore physiologic levels. Untreated POI is associated with multiple health risks, including premature death due to cardiovascular disease.</p>', '2025-08-29', NULL, '[]', '2025-08-29 18:44:47', '2025-09-02 14:34:00', '1756823640291.pdf', NULL),
(15, 2, 'Anand ', 'Reahul,deaapk', NULL, '', 'http://test.com', NULL, NULL, NULL, NULL, '2025-09-03 14:43:03', '2025-09-03 14:43:16', '1756910596913.pdf', '1756910596913.pdf'),
(16, 4, 'Nicotinamide mononucleotide (NMN) as an anti-aging health product – Promises and safety concerns', 'Harshani Nadeeshani a , Jinyao Li b, Tianlei Ying c, Baohong Zhang d, Jun Lu', 'Journal of Advanced Research', '10.1016/j.jare.2021.08.003', 'https://www.sciencedirect.com/science/article/pii/S2090123221001491', '', '2025-09-03', NULL, '[]', '2025-09-03 19:14:22', '2025-09-03 19:14:22', NULL, NULL),
(17, 11, 'ECG algorithms for localisation of outflow tract ventricular arrhythmias: is there a winner?', 'Bruno Wilnes, Beatriz Castello-Branco, Pasquale Santangeli', 'Heart', '10.1136/heartjnl-2025-326550', 'https://heart.bmj.com/content/early/2025/09/03/heartjnl-2025-326550?rss=1', '', '2025-09-03', NULL, '[]', '2025-09-03 19:15:40', '2025-09-03 19:16:11', '1756926971742.pdf', '1756926971742.pdf'),
(18, 11, 'Analysis and prediction of cardiovascular research hotspots, trends and interdisciplinarity', 'Zeye Liu, Ziping Li, Hong Jiang, Guangyu Pan, Wenchao Li, Fengwen Zhang, Wen-Bin Ou-yang, Shouzheng Wang, Cheng Wang, Xuanqi An, Anlin Dai, Ruibing Xia, Yakun Li, Xiaochun Sun, Yi Shi, Chengliang Yin, Xiang-Bin Pan', 'Heart', '10.1136/heartjnl-2025-325877', 'https://heart.bmj.com/content/early/2025/08/28/heartjnl-2025-325877', '<h3>Objective</h3>\n<p>Comprehensive data and analyses on cardiovascular research could clarify recent research trends for the academic community and facilitate policy development. We examined publications and reference data to identify research topics, trends and interdisciplinarity for cardiovascular disease (CVD).</p><h3>Methods</h3>\n<p>We extracted and clustered text fragments from the titles and abstracts of 2 512 445 publications using artificial intelligence techniques, including natural language processing (NLP) for semantic analysis. Cardiovascular experts identified topics and document clusters based on the output of those semiautomatic methods. We also applied machine learning algorithms to predict the trends over the next 5 years in each field. We examined the crossover between the two cluster groups using citation relationships in the documents.</p><h3>Results</h3>\n<p>Research in clinical studies showed the most notable increase; that was followed by research in population and basic studies. The research hotspots were minimally invasive treatments for valve disease, circulatory haemodynamics, and prevention and control of hypertension. The fastest-growing topics were health monitoring, evidence-based medicine and immunotherapy. We found extensive crossover relationships among document clusters for the periods of 2017–2018 and 2020–2021.</p><h3>Conclusions</h3>\n<p>This study provides valuable insights into the research hotspots for cardiovascular research, including an increasing emphasis on early disease detection and prevention, exploration of minimally invasive treatments and assessment of risk factors. The research landscape demonstrates signs of interdisciplinarity and integration as reflected in citation relationships. These findings suggest practical implications for optimising resource allocation in healthcare systems, guiding clinical guideline updates and informing policy-making to prioritise high-impact research areas aligned with evolving CVD challenges. Given the evolving global burden of CVD, continuous research and innovation are imperative, with interdisciplinary collaboration assuming a pivotal role in advancing scientific knowledge.</p>', '2025-09-03', NULL, '[]', '2025-09-03 19:20:59', '2025-09-03 19:20:59', NULL, NULL),
(19, 11, 'Nicotinamide mononucleotide (NMN) as an anti-aging health product – Promises and safety concerns', 'Harshani Nadeeshani a , Jinyao Li b, Tianlei Ying c, Baohong Zhang d, Jun Lu', 'Journal of Advanced Research', '10.1016/j.jare.2021.08.003', 'https://www.sciencedirect.com/science/article/pii/S2090123221001491', '', '2025-09-03', NULL, '[]', '2025-09-03 19:21:30', '2025-09-03 19:22:10', '1756927330784.pdf', '1756927330784.pdf'),
(20, 11, 'Pharmacological and Genetic Approaches to Downregulate FIS1 Mitigate Neuropathic Pain', 'Chang-Lei Zhu, Shu-Jiao Li, Zhi-Peng Lin, Zi-Wei Ni, Ke Tian, Yu-Lu Xia, Jing-Jing Tie, Xue-Yin Pu, Yun-Qiang Huang, Fei-Fei Wu, Hui Liu, Kun-Long Zhang, Shuai Zhang, You-Sheng Wu, Fei Tian, Nan-Nan Liu, Cai-Lian Ruan, Yan-Ling Yang, Ya-Yun Wang', 'Journal of Neuroscience', '10.1523/JNEUROSCI.0523-25.2025', 'https://www.jneurosci.org/content/45/35/e0523252025', '<p>Despite the established link between neuropathic pain and abnormal mitochondrial fission in neurons, the specific role of mitochondrial fission protein 1 (FIS1) in this process remains to be fully elucidated. In this study, the subjects we investigated were 6–8-week-old male mice. Comprehensive behavioral tests and immunostaining, along with Western blot analysis, revealed that neuropathic pain induced by spared nerve injury (SNI) upregulated FIS1 expression in the spinal cord dorsal horn (SC-DH). Furthermore, artificially upregulated FIS1 in SC-DH caused hyperalgesia behaviors in normal mice, while downregulation alleviated neuropathic pain. Using GAD2-MITO and vGluT2-MITO transgenic mice, we found that mitochondria network of both excitatory and inhibitory neurons in the SC-DH were disrupted. Selective downregulation of FIS1 in excitatory neurons via vGluT2-Cre mice reversed mitochondrial impairments and alleviated neuropathic pain. Network pharmacological prediction analysis combined with pharmacological tests indicated that compounds capable of downregulating FIS1 expression, such as epigallocatechin gallate, the primary bioactive component of tea polyphenols, may possess analgesic properties. In contrast, cinnamic acid, an organic acid derived from cinnamon bark, did not exhibit the capability to downregulate FIS1 expression and consequently lacked analgesic efficacy. Our research findings suggest that FIS1 may represent a novel molecular target for the treatment of neuropathic pain.</p>', '2025-09-04', NULL, '[]', '2025-09-04 19:19:37', '2025-09-04 19:19:37', NULL, NULL),
(22, 12, 'Pharmacological and Genetic Approaches to Downregulate FIS1 Mitigate Neuropathic Pain', 'Chang-Lei Zhu, Shu-Jiao Li, Zhi-Peng Lin, Zi-Wei Ni, Ke Tian, Yu-Lu Xia, Jing-Jing Tie, Xue-Yin Pu, Yun-Qiang Huang, Fei-Fei Wu, Hui Liu, Kun-Long Zhang, Shuai Zhang, You-Sheng Wu, Fei Tian, Nan-Nan Liu, Cai-Lian Ruan, Yan-Ling Yang, Ya-Yun Wang', 'Journal of Neuroscience', '10.1523/JNEUROSCI.0523-25.2025', 'https://www.jneurosci.org/content/45/35/e0523252025', '<p>Despite the established link between neuropathic pain and abnormal mitochondrial fission in neurons, the specific role of mitochondrial fission protein 1 (FIS1) in this process remains to be fully elucidated. In this study, the subjects we investigated were 6–8-week-old male mice. Comprehensive behavioral tests and immunostaining, along with Western blot analysis, revealed that neuropathic pain induced by spared nerve injury (SNI) upregulated FIS1 expression in the spinal cord dorsal horn (SC-DH). Furthermore, artificially upregulated FIS1 in SC-DH caused hyperalgesia behaviors in normal mice, while downregulation alleviated neuropathic pain. Using GAD2-MITO and vGluT2-MITO transgenic mice, we found that mitochondria network of both excitatory and inhibitory neurons in the SC-DH were disrupted. Selective downregulation of FIS1 in excitatory neurons via vGluT2-Cre mice reversed mitochondrial impairments and alleviated neuropathic pain. Network pharmacological prediction analysis combined with pharmacological tests indicated that compounds capable of downregulating FIS1 expression, such as epigallocatechin gallate, the primary bioactive component of tea polyphenols, may possess analgesic properties. In contrast, cinnamic acid, an organic acid derived from cinnamon bark, did not exhibit the capability to downregulate FIS1 expression and consequently lacked analgesic efficacy. Our research findings suggest that FIS1 may represent a novel molecular target for the treatment of neuropathic pain.</p>', '2025-09-05', NULL, '[]', '2025-09-05 04:27:28', '2025-09-05 04:27:28', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
CREATE TABLE IF NOT EXISTS `plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `article_limit` int DEFAULT '0',
  `price` decimal(10,2) NOT NULL,
  `duration_days` int DEFAULT '0',
  `features` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(10, 'Developer', 'developer@gmail.com', '$2b$10$D1q6jytg8nrpRk6aF5xBAel6jeVOfxMKWEkhiuxd8DC04bGT3QLgq', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-03 10:16:11', '2025-09-03 10:16:11'),
(11, 'New Test', 'newstudent@locker.com', '$2b$10$cNQNvGTFywADTtH8bQPkcOiPNHb1rSH/QKfndSXZguNSf0IeF.vSS', 'free', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-03 19:14:55', '2025-09-03 19:14:55'),
(12, 'Ranu Kumar', 'ranu@itfosters.com', '$2b$10$pYNlqTbITbvyNcln4TgWm.Yk5KCY8bd4dyQkExPxRJNuWK5gSulnS', 'free', NULL, NULL, '12-1757010308493-259916675.png', 'Male', 'Thank you for test', 'yelle university', 'New Delhi', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'cancer star', NULL, '2025-09-04 17:53:50', '2025-09-04 19:44:51');

-- --------------------------------------------------------

--
-- Table structure for table `user_plan`
--

DROP TABLE IF EXISTS `user_plan`;
CREATE TABLE IF NOT EXISTS `user_plan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `start_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `end_date` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `plan_id` (`plan_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_plan`
--

INSERT INTO `user_plan` (`id`, `user_id`, `plan_id`, `start_date`, `end_date`, `active`) VALUES
(2, 1, 2, '2025-09-05 10:59:48', '2026-09-05 10:59:48', 1);

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
