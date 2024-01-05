FROM node:18

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm install mysql@latest

RUN npm install -g nodemon

EXPOSE 3000

CMD ["nodemon", "app.js"]
