CREATE TABLE `StoreLocaleMapping` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `localeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `StoreLocaleMapping_storeId_localeId_key` (`storeId`,`localeId`),
  KEY `StoreLocaleMapping_storeId_idx` (`storeId`),
  KEY `StoreLocaleMapping_localeId_idx` (`localeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
