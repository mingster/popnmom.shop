CREATE TABLE `CrossSellProduct` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId1` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId2` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CrossSellProduct_productId1_idx` (`productId1`),
  KEY `CrossSellProduct_productId2_idx` (`productId2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
