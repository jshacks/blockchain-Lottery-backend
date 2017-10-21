FROM node:7.9.0

WORKDIR /src

ADD ./package.json /src/package.json
RUN npm install --loglevel silent

# RUN apt-get update

ADD ./ /src
ENV mongoserver mongo-server

EXPOSE 8080

CMD ["node", "/src/app.js"]
