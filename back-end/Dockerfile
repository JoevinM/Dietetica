FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY .env.build .env

RUN npx prisma generate

EXPOSE 10000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
