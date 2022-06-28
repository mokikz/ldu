FROM node:16.15-alpine

WORKDIR /usr/lerndieuhr
COPY ./mokikz-express /usr/lerndieuhr

EXPOSE 3000
RUN npm install
CMD node /usr/lerndieuhr/bin/www

