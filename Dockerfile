# Используем Node.js 18 на базе Alpine для лёгкого образа
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем весь код
COPY . .

# Собираем приложение для продакшна
RUN npm run build

# Финальный этап: раздача статических файлов
FROM node:18-alpine

# Устанавливаем serve для раздачи файлов
RUN npm install -g serve

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем собранные файлы из builder
COPY --from=builder /app/dist ./dist

# Открываем порт 5173
EXPOSE 5173

# Запускаем приложение
CMD ["serve", "-s", "dist", "-l", "5173"]
