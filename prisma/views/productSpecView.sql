drop view productSpecView;

create view productSpecView AS
select p.*,
    ps.specName,
    pso.optionId,
    pso.specId,
    pso.specValue,
    pso.price,
    pso.stock,
    pso.prepareDay,
    pso.sku
from Product p
    left join ProductSpec ps on p.id = ps.productId
    left join ProductSpecOptions pso on ps.specId = pso.specId