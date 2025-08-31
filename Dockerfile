# 🚀 Dockerfile para Frontend (Next.js)
# Imagen multi-stage para optimizar el tamaño del container

# ============================================
# STAGE 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Instalar dependencias
# Priorizar npm ci para builds más rápidas y reproducibles
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ============================================
# STAGE 2: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias del stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar todo el código fuente
COPY . .

# Variables de entorno para build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Construir la aplicación
RUN npm run build

# ============================================
# STAGE 3: Runner (Imagen final)
# ============================================
FROM node:20-alpine AS runner

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

WORKDIR /app

# Configurar usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Variables de entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copiar archivos necesarios para producción
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copiar archivos built de Next.js con permisos correctos
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar al usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Health check para verificar que la app está funcionando
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { \
    if (res.statusCode === 200) process.exit(0); \
    else process.exit(1); \
  }).on('error', () => process.exit(1))"

# Comando para ejecutar la aplicación con dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

# ============================================
# Metadata del container
# ============================================
LABEL org.opencontainers.image.title="Arandu Platform Frontend" \
      org.opencontainers.image.description="Frontend de la plataforma educativa Arandu construido con Next.js" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.authors="Team Arandu" \
      org.opencontainers.image.source="https://github.com/your-repo/arandu-platform"
