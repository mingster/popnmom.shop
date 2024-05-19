# Dev Setup & Coding Note

## Dev Environment

- [node.js / yarn / ...](https://github.com/mingster/dotfiles/blob/433ddf40a11b3ef2fb2b45721206376e24574d0b/install/web.sh)

- vs code and its [JS profile](https://vscode.dev/profile/github/7ddbc3501bada54a92352aca7dde0b5e)

``` fish
brew install --cask --appdir="/Applications/_dev" visual-studio-code
```

## Sign up for the services below

- [tiDB](https://tidbcloud.com/)
- [Cloudary](https://cloudinary.com)
- <s>[Planet scale](https://app.planetscale.com/)</s>

1. clone and install

``` fish
git clone https://github.com/mingster/popnmom.shop.git
cd popnmom.shop
yarn install
```

1. Setup Prisma / Database

- setup MySQL Database provider

``` bash
mysql -u root -p
create database popnmom;
create user 'localdev'@'localhost' identified by 'myPassword1@';
grant all on popnmom.* to 'localdev'@'localhost';
exit

# test the new user
mysql -u localdev -p
```

- get the connection string and add it to ```.env```

```ts
DATABASE_URL='mysql://localdev:myPassword@localhost/popnmom?'
```

- Generate prisma object

```shell
npx prisma generate
npx prisma db push
```

1. Cloudinary

- sign up to Cloudinary. This will be online file storage provider

edit ```.env``` to set up the following:

```ts
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET=
NEXT_PUBLIC_CLOUDINARY_APIKEY=
NEXT_PUBLIC_CLOUDINARY_APISECRET=
```

Update ```uploadPreset``` parameter in ```@/components/ui/image-upload.tsx```

## NextAuth

edit ``` /lib/authOptions.ts ``` to set up the providers.

## Populate default data

start admin site and visit: [http://localhost:3000/install](http://localhost:3000/install).  Click each button to populate default data.

## Coding Note

### How to compress assets and turn them into .tsx components

[gltfjsx](https://github.com/pmndrs/gltfjsx)

1. `npx gltf-pipeline -i model.gltf -o model.glb --draco.compressionLevel=10`
2. `npx gltfjsx model.gltf --types`

```shell
npx gltf-pipeline -i bigCross.gltf -o bigCross_compressed.gltf --draco.compressionLevel=10
npx gltfjsx bigCross_compressed.gltf --types --keepgroups --meta --precision 10
```

### manage packages

``` fish
yarn upgrade --pattern prisma --latest
```

### Linting (Eslint)

``` fish
yarn add eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-header eslint-plugin-import eslint-config-prettier --dev
```

## Resources
