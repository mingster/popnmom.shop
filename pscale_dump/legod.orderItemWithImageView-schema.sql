CREATE ALGORITHM=UNDEFINED DEFINER=`vt_app`@`localhost` SQL SECURITY DEFINER VIEW `orderItemWithImageView` AS select `item`.`id` AS `id`,`item`.`orderId` AS `orderId`,`item`.`productId` AS `productId`,`item`.`quantity` AS `quantity`,`item`.`unitDiscount` AS `unitDiscount`,`item`.`unitPrice` AS `unitPrice`,(select `p`.`name` from `Product` `p` where (`p`.`id` = `item`.`productId`)) AS `name`,(select `pi`.`url` from `ProductImage` `pi` where (`pi`.`productId` = `item`.`productId`) limit 1) AS `url` from `OrderItem` `item`;