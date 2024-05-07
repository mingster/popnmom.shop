CREATE TABLE `ShippingMethod` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `currencyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `basic_price` decimal(65,30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ShippingMethod_name_key` (`name`),
  KEY `ShippingMethod_name_idx` (`name`),
  KEY `ShippingMethod_currencyId_idx` (`currencyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
