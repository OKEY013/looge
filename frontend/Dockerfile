# 前端 Dockerfile
FROM node:16-alpine as builder

WORKDIR /app

# 复制 package.json 和安装依赖
COPY package*.json ./
RUN npm install

# 复制源代码并构建
COPY . .
RUN npm run build

# 使用 Nginx 作为 Web 服务器
FROM nginx:alpine

# 复制构建结果到 Nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]