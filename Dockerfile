FROM node:20
ENV NODE_ENV=production
WORKDIR /
# COPY ["package.json", "package-lock.json*", "./"]
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8500

CMD ["node", "index.js"]