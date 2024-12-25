FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --no-optional
COPY . .
CMD ["npm", "start"]
