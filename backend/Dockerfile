# Common dependencies stage
FROM node:20 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

#Development stage
FROM node:20 as development

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

CMD ["npm", "run", "start:dev"]

#Builder stage
FROM node:20 as builder

WORKDIR /app

COPY package*.json ./

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

# Production stage
FROM node:20

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
