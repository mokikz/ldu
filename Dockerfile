FROM node:alpine

COPY ./mokikz-express /lerndieuhr

EXPOSE 3000
RUN npm install --omit=dev
CMD node /lerndieuhr/bin/www

