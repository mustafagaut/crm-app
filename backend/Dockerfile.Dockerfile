# ---- Backend: Node.js + Express API ----
# Using the Debian-based "slim" image rather than Alpine: bcrypt is a native
# module, and its prebuilt binaries are far more reliable on glibc (Debian)
# than on musl libc (Alpine), where it can silently fail to load at runtime.
FROM node:20-slim

WORKDIR /app

# Install dependencies first (better layer caching — only reinstalls when
# package.json/package-lock.json actually change)
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the source
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/server.js"]
