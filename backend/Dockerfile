# 后端 Dockerfile
FROM node:16-alpine

WORKDIR /app

# 复制 package.json 和安装依赖
COPY package*.json ./
RUN npm install --production

# 复制源代码
COPY src ./src
COPY uploads ./uploads

# 创建上传目录
RUN mkdir -p uploads

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["npm", "start"]