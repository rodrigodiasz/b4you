# Etapa de build
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
COPY .sequelizerc ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de produção
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/.sequelizerc ./
COPY --from=build /app/src ./src
CMD ["node", "dist/index.js"]
