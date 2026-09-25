# Image already contains all browsers and OS dependencies required by Playwright 1.61.1
FROM mcr.microsoft.com/playwright:v1.61.1-noble

WORKDIR /app

ENV CI=true

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY . .

# Reports are written here and the folder is bind-mounted to the host (see docker-compose.yml)
CMD ["npx", "playwright", "test"]
