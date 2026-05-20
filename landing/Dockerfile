# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# 安装生产依赖
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# 从构建阶段复制构建结果
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
