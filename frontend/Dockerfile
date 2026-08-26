FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG NEXT_PUBLIC_DEV_URL
ENV NEXT_PUBLIC_DEV_URL=$NEXT_PUBLIC_DEV_URL

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
