FROM node:alpine

COPY ./mokikz-express /lerndieuhr

EXPOSE 3000
RUN npm install --production
CMD node /lerndieuhr/bin/www

