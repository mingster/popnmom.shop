
yarn upgrade --pattern next sharp @types/node --latest
yarn upgrade --pattern prisma ioredis --latest

yarn upgrade --pattern hookform axios --latest

yarn upgrade --pattern valtio zod zustand --latest

yarn upgrade --pattern stripe paypal @types/paypal --latest

yarn upgrade --pattern date-fns --latest

yarn upgrade --pattern react @types/react --latest
yarn upgrade --pattern @mui shadcn-ui --latest
yarn upgrade --pattern clsx --latest
yarn upgrade --pattern framer-motion typewriter-effect autoprefixer --latest

yarn upgrade --pattern three leva maath @types/three --latest

yarn upgrade --pattern tailwind prettier eslint @typescript-eslint --latest


rm -rf .next ./node_modules;
clear; yarn; yarn run build;