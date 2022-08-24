FROM node:latest
WORKDIR /app
COPY package*.json ./
COPY yarn*.json ./
RUN yarn global add typescript
RUN yarn install --
COPY . .
CMD ["yarn", "start"]