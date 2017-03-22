FROM node:alpine

COPY ./app.js /lerndieuhr/app.js
COPY ./package.json /lerndieuhr/package.json
COPY ./node_modules /lerndieuhr/node_modules
COPY ./package.json /lerndieuhr/package.json
COPY ./public /lerndieuhr/public

EXPOSE 3000

CMD node /lerndieuhr/app.js

