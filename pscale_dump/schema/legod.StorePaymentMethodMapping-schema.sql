CREATE TABLE `StorePaymentMethodMapping` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `storeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentMethodId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentDisplayName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `StorePaymentMethodMapping_storeId_paymentMethodId_key` (`storeId`,`paymentMethodId`),
  KEY `StorePaymentMethodMapping_storeId_idx` (`storeId`),
  KEY `StorePaymentMethodMapping_paymentMethodId_idx` (`paymentMethodId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
