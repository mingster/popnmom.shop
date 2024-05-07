# Populate default data for legod.org

1. DB setup

	set up your MySQL db in .env config

1. run prisma to populate schema

	```
	npx prisma generate
	npx prisma db push --force-reset
	```

1. create views

	Take the content of a SQL file located at ./script.sql and execute it on the database specified by the URL in the datasource block of your schema.prisma file:
	
	```
	npx prisma db execute --file ./prisma/views/orderItemWithImageView.sql \
	--schema ./prisma/schema.prisma
	```
	
	Do this for all sql under the view folder.

## Crate the data

```
for f in *[0-9].sql; 
do mysql --comments -u CK984gU58nfZrTa.root \
  -h gateway01.ap-northeast-1.prod.aws.tidbcloud.com -P 4000 -D legod --ssl-mode=VERIFY_IDENTITY --ssl-ca=/etc/ssl/cert.pem \
  -p3gOoS0Dop2DEDNti < $f ; 
done;

```



----------
## Ref ONLY: do not run those
```

for f in *-schema.sql; 
do mysql --comments -u CK984gU58nfZrTa.root \
  -h gateway01.ap-northeast-1.prod.aws.tidbcloud.com -P 4000 -D legod --ssl-mode=VERIFY_IDENTITY --ssl-ca=/etc/ssl/cert.pem \
  -p3gOoS0Dop2DEDNti < $f ; 
done;

```
