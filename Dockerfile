# ============================================
# Stage 1: Build React Frontend
# ============================================
FROM node:22-alpine AS frontend-build

WORKDIR /app/client

# Copy package files first for better caching
COPY client/package.json client/package-lock.json ./
RUN npm ci

# Copy source and build
COPY client/ ./
RUN npm run build

# ============================================
# Stage 2: Build .NET Backend
# ============================================
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS backend-build

WORKDIR /app/server

# Copy csproj and restore (cached layer)
COPY server/TaskManagerApi.csproj ./
RUN dotnet restore

# Copy source and publish
COPY server/ ./
RUN dotnet publish -c Release -o /app/publish

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS runtime

WORKDIR /app

# Copy published .NET app
COPY --from=backend-build /app/publish ./

# Copy React build into wwwroot
COPY --from=frontend-build /app/client/dist ./wwwroot

# Railway injects PORT as env var
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

ENTRYPOINT ["dotnet", "TaskManagerApi.dll"]
