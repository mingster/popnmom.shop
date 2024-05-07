CREATE TABLE `ProductPrice` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currencyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `oldPrice` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ProductPrice_currencyId_productId_key` (`currencyId`,`productId`),
  KEY `ProductPrice_currencyId_idx` (`currencyId`),
  KEY `ProductPrice_productId_idx` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
