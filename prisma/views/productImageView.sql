create view productImageView as

SELECT
  `img`.`id` AS `id`,
  `img`.`productId` AS `productId`,
  `img`.`url` AS `url`,
  `img`.`publicId` AS `publicId`,
  `img`.`name` AS `name`,
  `img`.`description` AS `description`,
  `img`.`shownInLandingPage` AS `shownInLandingPage`,
  `p`.`storeId` AS `storeId`
FROM
  (
    `ProductImage` `img`
    LEFT JOIN `Product` `p` ON((`img`.`productId` = `p`.`id`))
  )
