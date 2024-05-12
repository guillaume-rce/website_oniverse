-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : dim. 12 mai 2024 à 19:24
-- Version du serveur : 5.7.24
-- Version de PHP : 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `content`
--
CREATE DATABASE IF NOT EXISTS `content` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `content`;

-- --------------------------------------------------------

--
-- Structure de la table `articles`
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
-- Structure de la table `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `description` longtext,
  `logo` int(11) NOT NULL,
  `image` int(11) NOT NULL,
  `price` float DEFAULT NULL,
  `url` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `games`
--

INSERT INTO `games` (`id`, `name`, `description`, `logo`, `image`, `price`, `url`) VALUES
(1, 'Space Navigator', 'Explorer l\'espace et visiter des lieux inconnus !\nRecoltez des ressources et améliorez votre vaisseau pour aller toujours plus loin !', 0, 1, 9.8, 'http://www.game4.com'),
(2, 'EmojiQuizz', 'Trouvez le mot représenté par les emojis !\nPlus de 100 niveaux vous attendent !', 0, 2, 4.7, 'http://www.game4.com');

-- --------------------------------------------------------

--
-- Structure de la table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `path` text NOT NULL,
  `isLight` tinyint(1) NOT NULL DEFAULT '1',
  `uploadDateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `images`
--

INSERT INTO `images` (`id`, `path`, `isLight`, `uploadDateTime`) VALUES
(1, 'http://localhost:3001/img/SpaceNavigator.webp', 0, '2024-04-18 14:41:40'),
(2, 'http://localhost:3001/img/EmojiQuizz.webp', 0, '2024-04-18 14:41:40');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Base de données : `internal_data`
--
CREATE DATABASE IF NOT EXISTS `internal_data` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `internal_data`;

-- --------------------------------------------------------

--
-- Structure de la table `delivery_method`
--

CREATE TABLE `delivery_method` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `cost` float NOT NULL DEFAULT '0',
  `available` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `delivery_method`
--

INSERT INTO `delivery_method` (`id`, `name`, `cost`, `available`) VALUES
(1, 'Free delivery', 0, 1),
(2, 'Express delivery', 5, 1),
(3, 'Ultra fast delivery', 9.9, 1);

-- --------------------------------------------------------

--
-- Structure de la table `discount_code`
--

CREATE TABLE `discount_code` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `value` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `order`
--

CREATE TABLE `order` (
  `id` int(11) UNSIGNED NOT NULL,
  `user` int(11) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `country` text NOT NULL,
  `zipcode` tinytext NOT NULL,
  `address` text NOT NULL,
  `paymentMode` enum('CB','PAYPAL') NOT NULL DEFAULT 'CB',
  `deliveryMethod` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `state` enum('CONFIRMED','IN_PREPARATION','SEND','RECEIVED','CLOSED','MITIGE') NOT NULL,
  `creationDateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUpdateDateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `order`
--

INSERT INTO `order` (`id`, `user`, `name`, `country`, `zipcode`, `address`, `paymentMode`, `deliveryMethod`, `total`, `state`, `creationDateTime`, `lastUpdateDateTime`) VALUES
(1, 1, 'John Doe', 'USA', '90210', '1234 Boulevard St.', 'CB', 1, 59, 'CONFIRMED', '2024-05-11 17:07:43', '2024-05-11 17:07:43'),
(2, 1, 'Test', 'TestLand', '49100', '45 rue du Test', 'PAYPAL', 2, 29, 'CONFIRMED', '2024-05-11 17:17:12', '2024-05-11 17:17:12'),
(3, 1, 'TESTClear', 'jppjspojLand', '45666', '6 rue du heçhidh', 'PAYPAL', 2, 29, 'CONFIRMED', '2024-05-12 13:54:59', '2024-05-12 13:54:59'),
(4, 4, 'ROCHE', 'France', '49100', '15 rue beaurepaire', 'CB', 2, 29, 'CONFIRMED', '2024-05-12 17:13:43', '2024-05-12 17:13:43');

-- --------------------------------------------------------

--
-- Structure de la table `order_item`
--

CREATE TABLE `order_item` (
  `id` int(11) UNSIGNED NOT NULL,
  `order_id` int(11) UNSIGNED NOT NULL,
  `item_id` int(11) UNSIGNED NOT NULL,
  `quantity` tinyint(3) UNSIGNED NOT NULL DEFAULT '1',
  `isDigital` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `order_item`
--

INSERT INTO `order_item` (`id`, `order_id`, `item_id`, `quantity`, `isDigital`) VALUES
(1, 2, 2, 2, 1),
(2, 2, 1, 2, 1),
(3, 3, 2, 2, 1),
(4, 3, 1, 2, 1),
(5, 4, 2, 4, 1),
(6, 4, 1, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `users`
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
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `pseudo`, `email`, `password`, `image`, `banner`, `bio`, `role`, `registrationDateTime`) VALUES
(1, 'Testttt', 'test@test.com', '$2b$10$qylKni.dVwvCcaB6CpITBeBNx/NLYUSVhCRKo04360PbKUCmqqL7.', 'http://localhost:3001/img/1715018114660-image-pres.jpg', 'http://localhost:3001/img/1714120221744-windows-xp-bliss-4k-lu.jpg', NULL, 1, '2023-04-26 14:25:35'),
(2, 'Guillaume', 'groche@fealinx.com', '$2b$10$awmMN3PSdcDiqtqTjz.vPuZIBnZYUI98N8cbZwEb/PW5hzt7beKnG', NULL, NULL, NULL, 0, '2024-05-06 19:56:42'),
(3, 'username', 'user@example.com', '$2b$10$hfuSDRDipb6dVH1boEoZ0Onc7tD9uL97atlzOUsmDu2Ew491MWutG', NULL, NULL, NULL, 0, '2024-05-12 17:04:24'),
(4, 'Guillaume', 'groche@outlook.fr', '$2b$10$rx8ipmuosgJlJycfXc5.XuD1SUVuvpbFHJC4svhl6Fv9CQW/ubYLi', NULL, NULL, NULL, 0, '2024-05-12 17:06:34');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `delivery_method`
--
ALTER TABLE `delivery_method`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `discount_code`
--
ALTER TABLE `discount_code`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `delivery_method`
--
ALTER TABLE `delivery_method`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `discount_code`
--
ALTER TABLE `discount_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
