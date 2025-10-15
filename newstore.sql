-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 14 oct. 2025 à 16:56
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `newstore`
--

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `cart` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cart`)),
  `total` decimal(12,2) DEFAULT NULL,
  `notified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `offer` decimal(10,2) DEFAULT 0.00,
  `tax` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `fullname`, `email`, `phone`, `address`, `cart`, `total`, `notified`, `created_at`, `offer`, `tax`) VALUES
(47, 'Saif belfaquir', '', '0649157151', 'rue 430 nur 29 cite des fonctioner agadir', '[{\"id\":33,\"title\":\"asdas\",\"price\":200,\"description\":\"dadsa\",\"image\":\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760397775_Screenshot 2025-08-29 194159.png\",\"images\":[\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760397775_Screenshot 2025-08-29 194159.png\"],\"offer\":-10,\"created_at\":\"2025-10-14 00:22:55\",\"updated_at\":\"2025-10-14 00:35:20\",\"tax\":-10,\"qty\":1,\"total\":\"198.00\"}]', 198.00, 0, '2025-10-14 00:18:56', -10.00, -10.00),
(48, 'Saif belfaquir', '', '0649157151', 'rue 430 nur 29 cite des fonctioner agadir', '[{\"id\":23,\"title\":\"ch3r dyal zit \",\"price\":100,\"description\":\"waaaaaaaaa3r\",\"image\":\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_2af32395.jpg\",\"images\":[\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_2af32395.jpg\",\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_112a3211.jpg\",\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.28_0e8cd3ac.jpg\"],\"offer\":-10,\"created_at\":\"2025-10-12 04:49:22\",\"updated_at\":\"2025-10-14 00:35:29\",\"tax\":-10,\"qty\":1,\"total\":\"80.00\"}]', 99.00, 0, '2025-10-14 00:38:50', -10.00, -10.00),
(49, 'Saif belfaquir', '', '0649157151', 'rue 430 nur 29 cite des fonctioner agadir', '[{\"id\":23,\"title\":\"ch3r dyal zit \",\"price\":100,\"description\":\"waaaaaaaaa3r\",\"image\":\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_2af32395.jpg\",\"images\":[\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_2af32395.jpg\",\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_112a3211.jpg\",\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.28_0e8cd3ac.jpg\"],\"offer\":-10,\"created_at\":\"2025-10-12 04:49:22\",\"updated_at\":\"2025-10-14 00:35:29\",\"tax\":-10,\"qty\":1,\"total\":\"80.00\"}]', 99.00, 0, '2025-10-14 00:46:07', -10.00, -10.00),
(50, 'Saif belfaquir', '', '0649157151', 'rue 430 nur 29 cite des fonctioner agadir', '[{\"id\":23,\"title\":\"ch3r dyal zit \",\"price\":100,\"description\":\"waaaaaaaaa3r\",\"image\":\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_2af32395.jpg\",\"images\":[\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_2af32395.jpg\",\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_112a3211.jpg\",\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.28_0e8cd3ac.jpg\"],\"offer\":-10,\"created_at\":\"2025-10-12 04:49:22\",\"updated_at\":\"2025-10-14 00:35:29\",\"tax\":-10,\"qty\":1,\"total\":\"80.00\"}]', 99.00, 0, '2025-10-14 00:47:42', -10.00, -10.00),
(51, 'Saif belfaquir', '', '0649157151', 'rue 430 nur 29 cite des fonctioner agadir', '[{\"id\":23,\"title\":\"ch3r dyal zit \",\"price\":100,\"description\":\"waaaaaaaaa3r\",\"image\":\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_2af32395.jpg\",\"images\":[\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_2af32395.jpg\",\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_112a3211.jpg\",\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.28_0e8cd3ac.jpg\"],\"offer\":-10,\"created_at\":\"2025-10-12 04:49:22\",\"updated_at\":\"2025-10-14 00:35:29\",\"tax\":-10,\"qty\":1,\"total\":\"80.00\"}]', 99.00, 0, '2025-10-14 00:49:26', -10.00, -10.00),
(52, 'Saif belfaquir', '', '0649157151', 'rue 430 nur 29 cite des fonctioner agadir', '[{\"id\":23,\"title\":\"ch3r dyal zit \",\"price\":100,\"description\":\"waaaaaaaaa3r\",\"image\":\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_2af32395.jpg\",\"images\":[\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_2af32395.jpg\",\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_112a3211.jpg\",\"http:\\/\\/localhost\\/new-store\\/api\\/uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.28_0e8cd3ac.jpg\"],\"offer\":-10,\"created_at\":\"2025-10-12 04:49:22\",\"updated_at\":\"2025-10-14 00:35:29\",\"tax\":-10,\"qty\":1,\"total\":\"80.00\"}]', 81.00, 0, '2025-10-14 00:50:33', 0.00, 0.00);

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `images` text DEFAULT NULL,
  `offer` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tax` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `title`, `price`, `description`, `image`, `images`, `offer`, `created_at`, `updated_at`, `tax`) VALUES
(23, 'ch3r dyal zit ', 100.00, 'waaaaaaaaa3r', 'uploads/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_2af32395.jpg', '[\"uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_2af32395.jpg\",\"uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.26_112a3211.jpg\",\"uploads\\/1760240962_WhatsApp Image 2025-10-11 at 02.16.28_0e8cd3ac.jpg\"]', -10, '2025-10-12 03:49:22', '2025-10-13 23:35:29', -10.00),
(24, 'ch3r dyal zit 2', 200.00, 'hada wa3rrr ela lakhor ', 'uploads/1760241422_WhatsApp Image 2025-10-11 at 02.16.28_4600b0f0.jpg', '[\"uploads\\/1760241422_WhatsApp Image 2025-10-11 at 02.16.28_4600b0f0.jpg\",\"uploads\\/1760241422_WhatsApp Image 2025-10-11 at 02.16.26_112a3211.jpg\"]', -20, '2025-10-12 03:57:02', '2025-10-13 23:35:27', -10.00),
(25, 'pack dyal ch3r dyal zit ', 400.00, '3 wa3rin', 'uploads/1760241457_WhatsApp Image 2025-10-11 at 02.16.30_01ccb945.jpg', '[\"uploads\\/1760241457_WhatsApp Image 2025-10-11 at 02.16.30_01ccb945.jpg\",\"uploads\\/1760241457_WhatsApp Image 2025-10-11 at 02.16.30_4b1f8bcf.jpg\"]', -30, '2025-10-12 03:57:37', '2025-10-13 23:35:24', -10.00),
(26, 'pack dyal ch3r dyal zit 2', 600.00, 'hada wa3rr chwiya ', 'uploads/1760241501_WhatsApp Image 2025-10-11 at 02.16.30_4b1f8bcf.jpg', '[\"uploads\\/1760241501_WhatsApp Image 2025-10-11 at 02.16.30_4b1f8bcf.jpg\",\"uploads\\/1760241501_WhatsApp Image 2025-10-11 at 02.16.30_01ccb945.jpg\",\"uploads\\/1760241501_WhatsApp Image 2025-10-11 at 02.16.29_481472d5.jpg\",\"uploads\\/1760241501_WhatsApp Image 2025-10-11 at 02.16.28_0e8cd3ac.jpg\"]', -50, '2025-10-12 03:58:21', '2025-10-13 23:35:22', -10.00),
(27, 'zit ch3r wa3ra ', 12499.00, 'hadi katnwd lik zghob f 2s ', 'uploads/1760242118_WhatsApp Image 2025-10-11 at 02.16.29_481472d5.jpg', '[\"uploads\\/1760242118_WhatsApp Image 2025-10-11 at 02.16.29_481472d5.jpg\",\"uploads\\/1760242118_WhatsApp Image 2025-10-11 at 02.16.30_4b1f8bcf.jpg\"]', -2, '2025-10-12 04:08:38', '2025-10-13 23:35:14', -10.00),
(33, 'asdas', 200.00, 'dadsa', 'uploads/1760397775_Screenshot 2025-08-29 194159.png', '[\"uploads\\/1760397775_Screenshot 2025-08-29 194159.png\"]', -10, '2025-10-13 23:22:55', '2025-10-13 23:35:20', -10.00);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
