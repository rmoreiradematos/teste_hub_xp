FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN if [ ! -f tsconfig.json ]; then \
    echo '{ "compilerOptions": { "outDir": "./dist", "target": "ES2021" } }' > tsconfig.json; \
    fi

RUN npm ci
RUN npm run build

CMD ["npm", "run", "start:dev"]