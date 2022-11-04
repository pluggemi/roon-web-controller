# stage-1: build dist folder
FROM node:16-alpine as build
RUN ["mkdir", "-p", "/usr/src/app"]
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "/usr/src/app/"]
RUN apk add --no-cache git && \
    npm install
COPY . .
RUN npm run build

# stage-2: production image
FROM node:16-alpine
RUN ["mkdir", "-p", "/usr/src/app"]
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "/usr/src/app/"]
RUN apk add --no-cache git && \
    npm install --only=production && \
    apk del git
COPY ["backend/", "/usr/src/app/backend/"]
COPY --from=build ["/usr/src/app/dist", "/usr/src/app/dist"]
ENTRYPOINT [ "npm", "start" ]
EXPOSE 8080
