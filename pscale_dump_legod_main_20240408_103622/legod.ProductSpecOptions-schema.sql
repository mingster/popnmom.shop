CREATE TABLE `ProductSpecOptions` (
  `optionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `specId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `specValue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `stock` int NOT NULL DEFAULT '0',
  `prepareDay` int NOT NULL,
  `sku` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gtin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`optionId`),
  KEY `ProductSpecOptions_specId_idx` (`specId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
