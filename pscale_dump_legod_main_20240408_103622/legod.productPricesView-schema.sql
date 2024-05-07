CREATE ALGORITHM=UNDEFINED DEFINER=`vt_app`@`localhost` SQL SECURITY DEFINER VIEW `productPricesView` AS select `p`.`id` AS `id`,`p`.`storeId` AS `storeId`,`p`.`categoryId` AS `categoryId`,`p`.`name` AS `name`,`p`.`isFeatured` AS `isFeatured`,`p`.`createdAt` AS `createdAt`,`p`.`updatedAt` AS `updatedAt`,`p`.`status` AS `status`,`pp`.`price` AS `price`,`pp`.`currencyId` AS `currency` from (`Product` `p` left join `ProductPrice` `pp` on((`p`.`id` = `pp`.`productId`)));
