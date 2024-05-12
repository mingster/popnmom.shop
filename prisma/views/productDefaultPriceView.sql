
create view productDefaultPriceView as

select
p.*,
    `pp`.`price` AS `price`,
    `pp`.`currencyId` AS `currency`
from (
        `Product` `p`
        left join `ProductPrice` `pp` on(
            (
                (`p`.`id` = `pp`.`productId`)
                and (`pp`.`isDefault` = 1)
            )
        )
    )
