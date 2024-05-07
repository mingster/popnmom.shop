# popNmom.shop

popNmom.shop is shopping platform for multiple shops with its own store front, store owner portal.

this project is a typescript implmentation of E-Commerce + Dashboard & CMS.

## Features

- multiple shops and its management portal
- QR code on every product and shop
- unqiue URL of store front in 1-pager
- product catalog with presets
- 3D product configurator (set color / set words)
- shopping cart
- sign-ins/sign out (fb, line, email, etc)
- user profile / account

## Tech stack:

- [Next.js](https://nextjs.org) App Router, React, [Prisma ORM](https://www.prisma.io), MySQL at [tiDB](https://tidbcloud.com)
- [NextAuth](https://next-auth.js.org) Authentication
- [Tailwindcss](https://tailwindcss.com/docs/), [Shadcn UI](https://ui.shadcn.com), [Headless UI](https://headlessui.com/), [Lucide Icon](https://lucide.dev/icons/), [material-ui](https://mui.com/material-ui/)
- [Redis](https://redis.io) in a [cloud](https://app.redislabs.com/#/subscriptions)
- [Three.js](https://threejs.org) / Product customizer
- [Stripe](https://stripe.com/docs/stripe-js/react) checkout / webhooks
- PayPal

<!--
[react-payment-inputs](https://github.com/medipass/react-payment-inputs#requirements)
react-form-stepper
country-state-city
date-fns
[](https://github.com/Chris-Tsai/zipcode-tw-react)

7-11 shipping https://emap.presco.com.tw/c2cemap.ashx?eshopid=870&&servicetype=1&url={myURL}
### stripe ref:
https://betterprogramming.pub/complex-payment-flows-using-stripe-payment-intents-a-reactjs-nodejs-guide-5835f4c004cf
https://github.com/athoifss/Stripe-Payment-Intent

https://codingpr.com/stripe-and-react-typescript/

https://stripe.com/docs/payments/save-during-payment
-->

## Get it Running

### Prerequisites

**Node version 14.x**

### Cloning the repository

```shell
git clone https://github.com/mingster/popnmom.org.git
```

### Install packages

```shell
yarn install
```

### Setting up .env file

see .env-sample

### Setup database

```shell
npx prisma generate
npx prisma db push
```

### Start the app

```shell
yarn dev
```

navigate to [http://localhost:3000](http://localhost:3000) to see the site in action!


## Available commands

Running commands with npm `npm run [command]`

| command       | description                                    |
| :------------ | :--------------------------------------------- |
| `dev`         | Starts a development instance of the app       |
| `run build`   | makr a release build and ensure no build error |
| `start`       | run this app at port 3000                      |
| `lint`        | run ESLint                                     |
| `precommit`   | check staged file(s)                           |
| `commit`      | commit staged file(s) via cli wizard           |
| `postinstall` | Used by vercel deployment.                     |


## Docs

- [CONTRIBUTING](CONTRIBUTING.md)
- [DEPLOYMENT](DEPLOYMENT)
- [CODING_NOTE](CODING_NOTE.md)


## Resources

- [Create your React App in a minute with Vite](https://vitejs.dev/guide/)
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
- [React Three Fiber documentation](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [React Three Fiber examples](https://docs.pmnd.rs/react-three-fiber/getting-started/examples)
- [R3F Drei](https://github.com/pmndrs/drei#readme)
- [PBR Textures](https://3dtextures.me/)
- [Blender to three.js export guide](https://github.com/funwithtriangles/blender-to-threejs-export-guide/blob/master/readme.md)
- [gltf-viewer](https://gltf-viewer.donmccurdy.com/)
- [Valtio](https://github.com/pmndrs/valtio)
- [gltfjsx](https://github.com/pmndrs/gltfjsx)
- [VS Code + React + Typescript code quality setup 2020](https://dev.to/ziker22/ultimate-vs-code-react-typescript-code-quality-setup-2020-29gm)
