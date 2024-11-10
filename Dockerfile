# Usar la imagen base de Node.js versión 20.16.0
FROM node:20.16.0

# Instala Java (OpenJDK)
RUN apt-get update && apt-get install -y openjdk-17-jdk

# Directorio de trabajo
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de Node.js
RUN npm install

# Copia el resto de los archivos
COPY . .

# Compilar la aplicación frontend con webpack
RUN npm run dev

# Expon el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:server"]
