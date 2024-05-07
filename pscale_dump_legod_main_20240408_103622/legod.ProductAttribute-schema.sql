CREATE TABLE `ProductAttribute` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mfgPartNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isRecurring` tinyint(1) NOT NULL DEFAULT '0',
  `cycleLen` int DEFAULT NULL,
  `cyclePeriod` int DEFAULT NULL,
  `tytalCycles` int DEFAULT NULL,
  `isBrandNew` tinyint(1) NOT NULL DEFAULT '1',
  `isShipRequired` tinyint(1) NOT NULL DEFAULT '0',
  `isFreeShipping` tinyint(1) NOT NULL DEFAULT '0',
  `additionalShipCost` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `stock` int NOT NULL DEFAULT '0',
  `displayStockAvailability` tinyint(1) NOT NULL DEFAULT '0',
  `displayStockQuantity` tinyint(1) NOT NULL DEFAULT '0',
  `allowBackOrder` tinyint(1) NOT NULL DEFAULT '0',
  `orderMinQuantity` int NOT NULL DEFAULT '1',
  `orderMaxQuantity` int NOT NULL DEFAULT '0',
  `disableBuyButton` tinyint(1) NOT NULL DEFAULT '0',
  `weight` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `height` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `width` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `availableStartDate` datetime(3) DEFAULT NULL,
  `availableEndDate` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ProductAttribute_productId_key` (`productId`),
  KEY `ProductAttribute_productId_idx` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
