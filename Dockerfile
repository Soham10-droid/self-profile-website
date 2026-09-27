# 1. Start from a small official Node.js image
FROM node:22-alpine

# 2. All following commands run inside /app in the container
WORKDIR /app

# 3. Copy only the package files first so the install step is cached
COPY package*.json ./

# 4. Install production dependencies only (eslint is not needed to run the app)
RUN npm ci --omit=dev

# 5. Copy the rest of the source code
COPY . .

# 6. The pipeline passes in the commit ID, which the footer shows
ARG GIT_SHA=local
ENV GIT_SHA=$GIT_SHA PORT=3000 NODE_ENV=production

# 7. Do not run as root
USER node

EXPOSE 3000

# 8. Docker checks every 30 seconds that the app is still healthy
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
