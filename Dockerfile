# Multi-stage Dockerfile for a Next.js app (Node 24)
# Builder uses Debian slim for compatibility during build

########## Dependencies stage (production deps) ##########
FROM node:24-trixie-slim AS deps
WORKDIR /app

# Copy package metadata and install only production dependencies (for final image)
COPY package.json ./
RUN npm install --production


########## Builder stage (install dev deps & build) ##########
FROM node:24-trixie-slim AS builder
WORKDIR /app

# Déclarer les arguments de build
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_CLIENT_ID
ARG NEXT_PUBLIC_FRONTEND_URL

# Les transformer en variables d'env pour le processus de build
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_CLIENT_ID=$NEXT_PUBLIC_CLIENT_ID
ENV NEXT_PUBLIC_FRONTEND_URL=$NEXT_PUBLIC_FRONTEND_URL

# Copy everything so the build can access source files
COPY . .

# Install full dependencies (dev + prod) required for building
RUN npm install

# Build the Next.js app
RUN npm run build

########## Runner stage (smaller runtime image) ##########
FROM node:24-trixie-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy build output and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy package metadata (useful for runtime / inspection)
COPY --from=builder /app/package*.json ./

# Create non-root user and give ownership of app directory
RUN groupadd -r nextjs && useradd -r -g nextjs -d /app nextjs && chown -R nextjs:nextjs /app
USER nextjs

EXPOSE 3000

# Start in production mode with the application's start script
CMD ["npm", "start"]
