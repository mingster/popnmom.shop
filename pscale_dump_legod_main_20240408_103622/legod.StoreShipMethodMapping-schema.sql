CREATE TABLE `StoreShipMethodMapping` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `methodId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `StoreShipMethodMapping_storeId_methodId_key` (`storeId`,`methodId`),
  KEY `StoreShipMethodMapping_storeId_idx` (`storeId`),
  KEY `StoreShipMethodMapping_methodId_idx` (`methodId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
