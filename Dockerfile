FROM node:alpine

COPY ./mokikz-express /lerndieuhr

EXPOSE 3000

CMD node /lerndieuhr/bin/www

