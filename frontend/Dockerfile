FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_DEV_URL
ENV NEXT_PUBLIC_DEV_URL=$NEXT_PUBLIC_DEV_URL

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
