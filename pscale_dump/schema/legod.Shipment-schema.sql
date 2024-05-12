CREATE TABLE `Shipment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shippingMethodId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trackingNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trackingUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shippingCost` decimal(65,30) NOT NULL,
  `totalWeight` decimal(65,30) DEFAULT NULL,
  `shippedDate` datetime(3) DEFAULT NULL,
  `deliveryDate` datetime(3) DEFAULT NULL,
  `readyForPickupDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `shippingStatus` int NOT NULL DEFAULT '10',
  PRIMARY KEY (`id`),
  KEY `Shipment_orderId_idx` (`orderId`),
  KEY `Shipment_shippingMethodId_idx` (`shippingMethodId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
