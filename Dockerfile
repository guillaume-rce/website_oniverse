# Dockerfile pour le client
FROM node:20-slim as client

# Définir le répertoire de travail dans le conteneur Docker
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY client/package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application
COPY client/. .

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Dockerfile pour le serveur
FROM node:20-slim as server

# Définir le répertoire de travail dans le conteneur Docker
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY backend/package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application
COPY backend/. .

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3001
