FROM node:lts as build
WORKDIR /usr/src/app
ARG REACT_APP_API_URL
# ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package*.json ./
RUN yarn install 
COPY . .

EXPOSE 5173
CMD [ "yarn", "run", "dev" ]

# production environment
# FROM nginx:stable-alpine
# COPY --from=build /usr/src/app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]