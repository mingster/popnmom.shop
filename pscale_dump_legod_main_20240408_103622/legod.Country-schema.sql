CREATE TABLE `Country` (
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unCode` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `allowBilling` tinyint(1) NOT NULL DEFAULT '0',
  `allowShipping` tinyint(1) NOT NULL DEFAULT '0',
  `allowInStore` tinyint(1) NOT NULL DEFAULT '0',
  `alpha3` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`alpha3`),
  UNIQUE KEY `Country_unCode_key` (`unCode`),
  UNIQUE KEY `Country_alpha3_key` (`alpha3`),
  KEY `Country_name_idx` (`name`),
  KEY `Country_alpha3_idx` (`alpha3`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
