/*
select * from Locale;

select * from ShippingMethod;
select * from StoreShipMethodMapping;

insert into StoreShipMethodMapping(id,storeId, methodId) select UUID(), '2a05e4fc-0cd2-4675-b7c0-0bb98a774a20', s.id from ShippingMethod s;

select * from PaymentMethod;
select * from StorePaymentMethodMapping;

insert into StorePaymentMethodMapping(id,storeId,paymentMethodId,paymentDisplayName) select UUID(), '2a05e4fc-0cd2-4675-b7c0-0bb98a774a20', p.id,p.name from PaymentMethod p;

values('4e089c17-3b3f-4f20-ac0c-596ceb4de113', '2a05e4fc-0cd2-4675-b7c0-0bb98a774a20', 'f79a50af-b4d1-4f8d-a34a-7a5b1ca54f52','PayPal');


select * from ShippingMethod;
select * from PaymentMethod;

delete from ShippingMethod;
delete from PaymentMethod;
delete from StoreShipMethodMapping;
delete from StorePaymentMethodMapping;

select * from Country
select * from Currency order by id

delete from Currency


select * from productDefaultPriceView
*/


select * from StoreOrder;
select * from OrderNote;

select * from Product;
select * from OrderItem;
select * from ProductImage;

select productId from ProductImage pi group by productId;

select item.*, 
(select p.name from Product p where p.id=item.productId) as name,
(select pi.url from ProductImage pi where pi.productId=item.productId limit 1) as url 
from OrderItem item

SELECT C.*,
      (SELECT P.id, P.title 
       FROM products as P
       WHERE P.category_id = C.id
       LIMIT 1)
FROM categories C


alter view orderItemWithImageView as 
    select item.*, 
    (select p.name from Product p where p.id=item.productId) as name,
    (select pi.url from ProductImage pi where pi.productId=item.productId limit 1) as url 
    from OrderItem item


select * from orderItemWithImageView;
/*
select * from Store;
select * from StoreLocaleMapping;

delete from StoreOrder;
delete from OrderItem;
delete from OrderNote;

delete from Store where id = 'd72b0921-06c0-4b6f-8a32-5513ee6609ff';

select * from Product;
select * from ProductImage;
select * from ProductPrice;
select * from ProductReview;
select * from ProductAttribute;
select * from ProductSpec;

insert into ProductSpec(id, productId, specName) values('acdff4fa-4cff-45cb-98cc-038dff2c1652','acdff4fa-4cff-45cb-98cc-038dff2c1651','<STD>')
insert into ProductAttribute(id,productId, stock, description)values('acdff4fa-4cff-45cb-98cc-038dff2c1652','acdff4fa-4cff-45cb-98cc-038dff2c1651',100, 'description')

select * from User;
select * from Account;
select * from Session;
select * from Address;

delete from User where id='clqzb4l560000y896zp0nc6fu';delete from Account where userId not in (select id from User);
delete from User where id='clr3061au0000n0lr25htfcwu';delete from Account where userId not in (select id from User);

insert into ProductReview(id,customerid,productid,storeid,reviewText,rating,updatedAt)values('acdff4fa-4cff-45cb-98cc-038dff2c1651','clmn9volb000044yrr5jh75ot','acdff4fa-4cff-45cb-98cc-038dff2c1651','5c8b8fb7-1634-4852-ae2f-96e5f4d2fd88','大家一起上課，拼出自己的創意，這是今年最好的團契活動。',5,now());
select * from Image;

insert into ProductPrice(id,currencyId, productId, price) values('acdff4fa-4cff-45cb-98cc-038dff2c1653','USD','acdff4fa-4cff-45cb-98cc-038dff2c1651',10)


select * from Store;


select * from User;
select * from Account;
select * from Session;
select * from VerificationToken;
*/