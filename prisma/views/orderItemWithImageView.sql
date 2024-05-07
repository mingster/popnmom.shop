drop view orderItemWithImageView;

create view orderItemWithImageView as
  select item.*, 
  (select p.name from Product p where p.id=item.productId) as name,
  (select pi.url from ProductImage pi where pi.productId=item.productId limit 1) as url 
  from OrderItem item