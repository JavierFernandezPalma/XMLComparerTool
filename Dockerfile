# Usa una imagen base de Node.js
FROM node:16

# Instala Java (OpenJDK)
RUN apt-get update && apt-get install -y openjdk-11-jre

# Directorio de trabajo
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de Node.js
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expon el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start"]
