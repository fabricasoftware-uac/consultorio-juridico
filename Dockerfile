# syntax=docker/dockerfile:1

##########################################################################
# Frontend Next.js 15 (App Router) — build multi-stage con salida standalone
# Requiere `output: "standalone"` en next.config.ts
##########################################################################

# ---------- deps: instala dependencias (incluye devDeps para el build) ----------
FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN npm install -g pnpm@9
# pnpm-workspace.yaml controla qué paquetes pueden compilar código nativo
# (sharp, @tailwindcss/oxide, supabase). Se copia para respetar esa política.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- builder: compila la app ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app
RUN npm install -g pnpm@9
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Las variables NEXT_PUBLIC_* se "hornean" en el bundle del cliente durante
# `next build`, por eso llegan como ARG. Si cambian, hay que RECONSTRUIR la imagen.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ---------- runner: imagen final mínima ----------
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Salida standalone: server.js + node_modules mínimos, assets estáticos y /public
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
