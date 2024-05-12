CREATE TABLE `ShippingMethodPrice` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `methodId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dimension_length` int NOT NULL,
  `dimension_width` int NOT NULL,
  `dimension_height` int NOT NULL,
  `dimension_weight` int NOT NULL,
  `price` decimal(65,30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ShippingMethodPrice_methodId_idx` (`methodId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
