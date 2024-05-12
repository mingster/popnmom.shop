CREATE TABLE `LocaleResource` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resourceName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resourceValue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `localeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `LocaleResource_resourceName_idx` (`resourceName`),
  KEY `LocaleResource_localeId_idx` (`localeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
