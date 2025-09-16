#Common dependencies
FROM node:22-alpine as deps
WORKDIR /app
COPY package*.json ./
RUN npm install

#Development stage

FROM node:22-alpine as development

WORKDIR /app

COPY --from=deps ./app/node_modules ./node_modules

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]

#Build stage

FROM node:22-slim as builder

WORKDIR /app

COPY --from=deps ./app/node_modules ./node_modules

COPY . .

RUN npm run build

#Production stage

FROM node:22-slim AS production
WORKDIR /app

COPY --from=builder /app/.next/standalone ./

EXPOSE 3000

CMD ["node", "server.js"]
