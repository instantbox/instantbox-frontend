FROM node:lts-alpine AS builder

WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY ./ /app/
RUN npm run build


FROM nginx:stable-alpine

LABEL \
  org.label-schema.schema-version="1.0" \
  org.label-schema.name="instantbox-frontend" \
  org.label-schema.vcs-url="https://github.com/instantbox/instantbox-frontend" \
  maintainer="Instantbox Team <team@instantbox.org>"

COPY --from=builder /app/build/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ARG BUILD_DATE
ARG VCS_REF
LABEL \
  org.label-schema.build-date=$BUILD_DATE \
  org.label-schema.vcs-ref=$VCS_REF
