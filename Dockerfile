FROM node:18
WORKDIR /app
COPY . /app
RUN apt update
RUN npm install