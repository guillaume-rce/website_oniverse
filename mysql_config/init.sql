-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 05, 2024 at 04:43 PM
-- Server version: 5.7.24
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `content`
--
CREATE DATABASE IF NOT EXISTS `content` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `content`;

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` mediumtext NOT NULL,
  `content` longtext NOT NULL,
  `image` int(11) NOT NULL,
  `uploadDateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `description` longtext,
  `logo` int(11) NOT NULL,
  `image` int(11) NOT NULL,
  `video` text,
  `price` float DEFAULT NULL,
  `url` text,
  `stock` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`id`, `name`, `description`, `logo`, `image`, `video`, `price`, `url`, `stock`) VALUES
(1, 'Space Navigator', 'Explorez l\'espace et visitez des lieux inconnus !\nRecoltez des ressources et améliorez votre vaisseau pour aller toujours plus loin !', 5, 1, 'http://localhost:3001/public/videos/1716986615807-1.mp4', 9.9, 'http://www.game4.com', 11),
(2, 'EmojiQuizz', 'Trouvez le mot représenté par les emojis !\nPlus de 100 niveaux vous attendent !', 15, 2, 'http://localhost:3001/public/videos/1716991081144-2.mp4', 4.5, 'http://www.game4.com', 0),
(3, 'Stray', 'Stray est un jeu d\'aventures sur PS5 qui nous laisse incarner un chat errant en vue à la troisième personne.', 4, 3, NULL, 40, NULL, 17),
(4, 'Sea of thieves', 'Sea of Thieves est un jeu vidéo d\'action-aventure développé par Rare et édité par Xbox Game Studios.', 7, 6, NULL, 20, NULL, 23),
(5, 'Dragon’s dogma 2', 'Dragon\'s Dogma 2 est un jeu vidéo action-RPG développé et publié par Capcom. Suite de Dragon\'s Dogma, sorti en 2012.', 9, 8, NULL, 35, NULL, 39),
(6, 'Stronghold legends', 'Stronghold Legends est un jeu vidéo de stratégie et de gestion développé par Firefly Studios et édité par 2K Games en 2006.', 12, 10, NULL, 8, NULL, 8),
(7, 'Summerhouse', 'Summerhouse est un jeu vidéo de 2024 du développeur allemand indépendant Friedemann Allmenröder et publié pour Windows et Macintosh par Future Friends Games.', 14, 13, NULL, 23, NULL, 26),
(8, 'Hellblade', 'Hellblade: Senua\'s Sacrifice est un jeu vidéo de type action-aventure édité et développé par Ninja Theory, sorti le 8 août 2017 sur Windows et PlayStation 4, le 11 avril 2018 sur Xbox One et le 11 avril 2019 sur Nintendo Switch.', 16, 15, NULL, 32, NULL, 24),
(9, 'Pacific Drive', 'Pacific Drive est un jeu vidéo de survie développé par Ironwood Studios et publié par Kepler Interactive. Le jeu se déroule dans le Nord-Ouest Pacifique, que le joueur traverse à pied ou en break alors qu\'il tente de trouver un moyen de s\'échapper.', 18, 17, NULL, 29.9, NULL, 3);

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `path` text NOT NULL,
  `isLight` tinyint(1) NOT NULL DEFAULT '1',
  `uploadDateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `path`, `isLight`, `uploadDateTime`) VALUES
(1, 'http://localhost:3001/public/img/SpaceNavigator.webp', 0, '2024-04-18 14:41:40'),
(2, 'http://localhost:3001/public/img/EmojiQuizz.webp', 0, '2024-04-18 14:41:40'),
(3, 'http://localhost:3001/public/img/1717593127984-stray.jpg', 0, '2024-06-05 15:12:07'),
(4, 'http://localhost:3001/public/img/1717593127987-stray-logo.webp', 0, '2024-06-05 15:12:08'),
(5, 'http://localhost:3001/public/img/1717593214694-logo.png', 0, '2024-06-05 15:13:34'),
(6, 'http://localhost:3001/public/img/1717593318620-SOT.jpg', 0, '2024-06-05 15:15:18'),
(7, 'http://localhost:3001/public/img/1717593318629-SOT_logo.webp', 0, '2024-06-05 15:15:18'),
(8, 'http://localhost:3001/public/img/1717593779124-Dragons-Dogma.webp', 0, '2024-06-05 15:22:59'),
(9, 'http://localhost:3001/public/img/1717593779124-dragon-logo.jpg', 0, '2024-06-05 15:22:59'),
(10, 'http://localhost:3001/public/img/1717594222225-stronghold.jpg', 0, '2024-06-05 15:30:22'),
(11, 'http://localhost:3001/public/img/1717594222231-stronghold-logo.png', 0, '2024-06-05 15:30:22'),
(12, 'http://localhost:3001/public/img/1717594303580-stronghold-logo.jpg', 0, '2024-06-05 15:31:43'),
(13, 'http://localhost:3001/public/img/1717594464457-summerhouse.jpg', 0, '2024-06-05 15:34:24'),
(14, 'http://localhost:3001/public/img/1717594464476-Summerhouse-logo.png', 0, '2024-06-05 15:34:24'),
(15, 'http://localhost:3001/public/img/1717594663259-Hellblade.jpeg', 0, '2024-06-05 15:37:43'),
(16, 'http://localhost:3001/public/img/1717594663260-hellblade-logo.jpg', 0, '2024-06-05 15:37:43'),
(17, 'http://localhost:3001/public/img/1717594884156-pacific_drive.webp', 0, '2024-06-05 15:41:24'),
(18, 'http://localhost:3001/public/img/1717594884159-pacific-drive-logo.jpg', 0, '2024-06-05 15:41:24');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tags_association`
--

CREATE TABLE `tags_association` (
  `id` int(10) UNSIGNED NOT NULL,
  `idTag` int(10) UNSIGNED NOT NULL,
  `idGame` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tags_association`
--
ALTER TABLE `tags_association`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tags_association`
--
ALTER TABLE `tags_association`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Database: `internal_data`
--
CREATE DATABASE IF NOT EXISTS `internal_data` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `internal_data`;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_method`
--

CREATE TABLE `delivery_method` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `cost` float NOT NULL DEFAULT '0',
  `available` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `delivery_method`
--

INSERT INTO `delivery_method` (`id`, `name`, `cost`, `available`) VALUES
(1, 'Free delivery', 0, 1),
(2, 'Express delivery', 5, 1),
(3, 'Ultra fast delivery', 9.9, 1);

-- --------------------------------------------------------

--
-- Table structure for table `discount_code`
--

CREATE TABLE `discount_code` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `value` int(11) NOT NULL DEFAULT '0',
  `usable` tinyint(1) NOT NULL DEFAULT '0',
  `public` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `discount_code`
--

INSERT INTO `discount_code` (`id`, `name`, `value`, `usable`, `public`) VALUES
(1, 'HappyDay', 20, 1, 1),
(3, 'JustForYou', 80, 1, 0),
(4, 'PrivateBetaSell', 25, 1, 0),
(5, 'OniverseNewWork', 40, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) UNSIGNED NOT NULL,
  `user` int(11) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `country` text NOT NULL,
  `zipcode` tinytext NOT NULL,
  `address` text NOT NULL,
  `paymentMode` enum('CB','PAYPAL') NOT NULL DEFAULT 'CB',
  `discountCode` int(11) NOT NULL,
  `deliveryMethod` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `state` enum('CONFIRMED','IN_PREPARATION','SEND','RECEIVED','CLOSED','MITIGE') NOT NULL,
  `creationDateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUpdateDateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `user`, `name`, `country`, `zipcode`, `address`, `paymentMode`, `discountCode`, `deliveryMethod`, `total`, `state`, `creationDateTime`, `lastUpdateDateTime`) VALUES
(1, 2, 'Timot', 'Angers', '49100', '5 rue du Blabla', 'PAYPAL', 1, 1, 110, 'CLOSED', '2024-06-05 16:02:08', '2024-06-05 16:23:41'),
(2, 4, 'Julien Robert', 'France', '44210', '56 rue du haut pronic', 'CB', 0, 2, 88, 'CONFIRMED', '2024-06-05 16:11:37', '2024-06-05 16:11:37'),
(3, 4, 'Julien Robert', 'France', '44210', '4 résidence du haut pornic', 'PAYPAL', 0, 2, 76, 'MITIGE', '2024-06-05 16:12:12', '2024-06-05 16:12:45'),
(4, 5, 'Claire Durant', 'France', '75020', '5 rue du Claire', 'CB', 0, 1, 63, 'CONFIRMED', '2024-06-05 16:22:15', '2024-06-05 16:22:15');

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `id` int(11) UNSIGNED NOT NULL,
  `order_id` int(11) UNSIGNED NOT NULL,
  `item_id` int(11) UNSIGNED NOT NULL,
  `quantity` tinyint(3) UNSIGNED NOT NULL DEFAULT '1',
  `cost` float NOT NULL,
  `isDigital` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`id`, `order_id`, `item_id`, `quantity`, `cost`, `isDigital`) VALUES
(1, 1, 3, 2, 40, 1),
(2, 1, 7, 1, 23, 1),
(3, 1, 5, 1, 35, 1),
(4, 2, 6, 1, 8, 1),
(5, 2, 8, 1, 32, 1),
(6, 2, 4, 1, 20, 1),
(7, 2, 7, 1, 23, 1),
(8, 3, 3, 1, 40, 1),
(9, 3, 7, 1, 23, 1),
(10, 3, 6, 1, 8, 1),
(11, 4, 7, 1, 23, 1),
(12, 4, 4, 1, 20, 1),
(13, 4, 1, 2, 9.9, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `pseudo` text NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` text,
  `banner` text,
  `bio` longtext,
  `role` int(11) NOT NULL DEFAULT '0',
  `registrationDateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `pseudo`, `email`, `password`, `image`, `banner`, `bio`, `role`, `registrationDateTime`) VALUES
(1, 'Admin', 'admin@admin.com', '$2b$10$qylKni.dVwvCcaB6CpITBeBNx/NLYUSVhCRKo04360PbKUCmqqL7.', 'http://localhost:3001/public/img/1717595685417-WIN_20240513_15_04_26_Pro.jpg', 'http://localhost:3001/public/img/1717595713309-fond.ico', 'Hello ! Je suis l\'admin suprême ! Un problème ? Je suis là ! ', 1, '2023-04-26 14:25:35'),
(2, 'Timothee', 'timot@gmail.com', '$2b$10$eDzY4Mm44fJk6lIr16FHMucNkJrcWaXTwKvj3u/wph7uW96.jVd0e', 'http://localhost:3001/public/img/1717596017492-fleur.jpg', 'http://localhost:3001/public/img/1717596021339-pager 7.jpg', NULL, 0, '2024-06-05 15:59:46'),
(3, 'Admin 2', 'admin2@admin.com', '$2b$10$/qBUwq3diLASCY1trgrUtuTRK3mrcvMI7nVhYx1wAxq.1qJqjBb82', NULL, NULL, NULL, 1, '2024-06-05 16:04:02'),
(4, 'Julien.rbt', 'julien.robert@gmail.com', '$2b$10$8ST2EY8g.095LgLR7PHMWO7oqjKXnfWDXeUZscXXiQCG.xsglzJ/m', 'http://localhost:3001/public/img/1717596745609-Image2rog.jpg', 'http://localhost:3001/public/img/1717596750016-lune.jpg', NULL, 0, '2024-06-05 16:10:51'),
(5, 'Claireee', 'claire.durand@projet-xyz.fr', '$2b$10$.5AyRhidb7OubG2OKsnrOOYtDuRSqxEwEcRBnKpg5BGnVUoRVKhBi', NULL, NULL, NULL, 0, '2024-06-05 16:21:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `delivery_method`
--
ALTER TABLE `delivery_method`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `discount_code`
--
ALTER TABLE `discount_code`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `delivery_method`
--
ALTER TABLE `delivery_method`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `discount_code`
--
ALTER TABLE `discount_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
