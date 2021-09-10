FROM node:14
WORKDIR /usr/src/amps-publisher
COPY package*.json ./
RUN npm install
COPY src ./
CMD ["node", "./index.js" ]