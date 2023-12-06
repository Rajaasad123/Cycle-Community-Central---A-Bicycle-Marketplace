-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Nov 26, 2023 at 12:00 AM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bycyclecommunity`
--

-- --------------------------------------------------------

--
-- Table structure for table `bicycles`
--

DROP TABLE IF EXISTS `bicycles`;
CREATE TABLE IF NOT EXISTS `bicycles` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` text NOT NULL,
  `Quantity` int NOT NULL,
  `Condition` text NOT NULL,
  `Description` text NOT NULL,
  `Specification` text NOT NULL,
  `Price` double NOT NULL,
  `Color` text NOT NULL,
  `Size` text NOT NULL,
  `CSTM` json NOT NULL,
  `PurchaseMode` text NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bicycles`
--

INSERT INTO `bicycles` (`Id`, `Title`, `Quantity`, `Condition`, `Description`, `Specification`, `Price`, `Color`, `Size`, `CSTM`, `PurchaseMode`) VALUES
(7, 'Mountain Explorer', 5, 'New', 'High-performance mountain bike', 'Aluminum frame, 27-speed', 499.99, 'Red', 'Medium', '{\"discount\": 0.1, \"customerID\": \"XYZ123\"}', 'Buy'),
(8, 'Urban Cruiser', 10, 'Used', 'Comfortable city bike', 'Steel frame, 7-speed', 299.99, 'Green', 'Large', '{\"discount\": 0.05, \"customerID\": \"ABC456\"}', 'Rent'),
(9, 'Speed Demon', 8, 'New', 'Sleek and fast road bike', 'Carbon fiber frame, 22-speed', 799.99, 'Blue', 'Small', '{\"discount\": 0.12, \"customerID\": \"DEF789\"}', 'Buy'),
(10, 'Off-Road Beast', 3, 'Used', 'Heavy-duty off-road bike', 'Steel frame, 18-speed', 449.99, 'Black', 'Large', '{\"discount\": 0.08, \"customerID\": \"GHI012\"}', 'Rent'),
(11, 'City Explorer', 7, 'New', 'Versatile city commuting bike', 'Aluminum frame, 8-speed', 369.99, 'Red', 'Medium', '{\"discount\": 0.15, \"customerID\": \"JKL345\"}', 'Buy'),
(12, 'Family Cruiser', 12, 'Used', 'Sturdy family bike', 'Steel frame, 3-speed', 249.99, 'Green', 'Large', '{\"discount\": 0.07, \"customerID\": \"MNO678\"}', 'Rent'),
(13, 'Swift Sprinter', 6, 'New', 'Agile racing bike', 'Carbon fiber frame, 20-speed', 899.99, 'Blue', 'Small', '{\"discount\": 0.09, \"customerID\": \"PQR901\"}', 'Buy'),
(14, 'Trail Blazer', 4, 'Used', 'Rugged trail bike', 'Aluminum frame, 16-speed', 529.99, 'Black', 'Large', '{\"discount\": 0.11, \"customerID\": \"STU234\"}', 'Rent'),
(15, 'City Explorer II', 9, 'New', 'Upgraded versatile city bike', 'Aluminum frame, 10-speed', 429.99, 'Red', 'Medium', '{\"discount\": 0.14, \"customerID\": \"VWX567\"}', 'Buy'),
(16, 'Night Rider', 2, 'Used', 'Sleek night cycling bike', 'Carbon fiber frame, 18-speed', 749.99, 'Green', 'Large', '{\"discount\": 0.06, \"customerID\": \"YZA890\"}', 'Rent'),
(17, 'All-Terrain Explorer', 11, 'New', 'Versatile all-terrain bike', 'Aluminum frame, 12-speed', 449.99, 'Blue', 'Small', '{\"discount\": 0.13, \"customerID\": \"BCD123\"}', 'Buy'),
(18, 'Classic Cruiser', 8, 'Used', 'Timeless cruiser bike', 'Steel frame, 5-speed', 279.99, 'Black', 'Large', '{\"discount\": 0.1, \"customerID\": \"EFG456\"}', 'Rent'),
(19, 'Speedy Sprinter', 5, 'New', 'Speed-focused racing bike', 'Carbon fiber frame, 24-speed', 999.99, 'Red', 'Medium', '{\"discount\": 0.08, \"customerID\": \"HIJ789\"}', 'Buy'),
(20, 'City Sleek', 7, 'Used', 'Sleek city commuting bike', 'Aluminum frame, 9-speed', 389.99, 'Green', 'Large', '{\"discount\": 0.12, \"customerID\": \"KLM012\"}', 'Rent'),
(21, 'Wild Explorer', 3, 'New', 'Wilderness exploration bike', 'Steel frame, 15-speed', 569.99, 'Blue', 'Small', '{\"discount\": 0.1, \"customerID\": \"NOP345\"}', 'Buy'),
(22, 'Adventure Seeker', 10, 'Used', 'Adventure-ready bike', 'Aluminum frame, 14-speed', 499.99, 'Black', 'Large', '{\"discount\": 0.07, \"customerID\": \"QRS678\"}', 'Rent'),
(23, 'City Zen', 6, 'New', 'Zen-like city bike', 'Carbon fiber frame, 11-speed', 419.99, 'Red', 'Medium', '{\"discount\": 0.09, \"customerID\": \"TUV901\"}', 'Buy'),
(24, 'Night Hawk', 4, 'Used', 'Nocturnal cycling enthusiast bike', 'Steel frame, 6-speed', 299.99, 'Green', 'Large', '{\"discount\": 0.11, \"customerID\": \"WXY234\"}', 'Rent'),
(25, 'Trail Master', 8, 'New', 'Master of off-road trails', 'Aluminum frame, 17-speed', 529.99, 'Blue', 'Small', '{\"discount\": 0.1, \"customerID\": \"ZAB567\"}', 'Buy'),
(26, 'Vintage Cruiser', 7, 'Used', 'Vintage-style cruiser bike', 'Steel frame, 4-speed', 259.99, 'Black', 'Large', '{\"discount\": 0.08, \"customerID\": \"CDE890\"}', 'Rent');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Comment` text NOT NULL,
  `Datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `bycycleId` int NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`Id`, `Comment`, `Datetime`, `bycycleId`) VALUES
(1, 'Great bike! I love the Green Urban Cruiser.', '2023-11-25 23:55:06', 8),
(2, 'Great bike! I love the Black Trail Blazer.', '2023-11-25 23:55:06', 14),
(3, 'Great bike! I love the Green Family Cruiser.', '2023-11-25 23:55:06', 12),
(4, 'Awesome choice for a Large Black Adventure Seeker.', '2023-11-25 23:55:06', 22),
(5, 'Awesome choice for a Medium Red Mountain Explorer.', '2023-11-25 23:55:06', 7),
(6, 'Smooth ride on the City Sleek!', '2023-11-25 23:55:06', 20),
(7, 'Smooth ride on the Adventure Seeker!', '2023-11-25 23:55:06', 22),
(8, 'Smooth ride on the Vintage Cruiser!', '2023-11-25 23:55:06', 26),
(9, 'Smooth ride on the Trail Blazer!', '2023-11-25 23:55:06', 14);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
