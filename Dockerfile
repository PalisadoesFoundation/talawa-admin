# Step 1: Build Stage
FROM node:20.10.0-alpine AS builder
WORKDIR /talawa-admin

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production

RUN npm run build

#Step 2: Production
FROM nginx:1.27.3-alpine AS production

ENV NODE_ENV=production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /talawa-admin/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]