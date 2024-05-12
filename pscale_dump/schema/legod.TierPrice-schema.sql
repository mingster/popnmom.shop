CREATE TABLE `TierPrice` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `minQty` int NOT NULL,
  `maxQty` int DEFAULT NULL,
  `price` decimal(65,30) NOT NULL,
  `startingDate` datetime(3) DEFAULT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `currencyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'usd',
  PRIMARY KEY (`id`),
  KEY `TierPrice_productId_idx` (`productId`),
  KEY `TierPrice_currencyId_idx` (`currencyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
