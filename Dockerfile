# Usar una imagen base de Node.js
FROM node:16

# Instalar OpenJDK 11 (Java)
RUN apt-get update && apt-get install -y openjdk-11-jdk

# Configurar JAVA_HOME
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar todos los archivos del proyecto
COPY . .

# Instalar dependencias
RUN npm install

# Exponer el puerto 3000 (o el puerto que necesite tu app)
EXPOSE 3000

# Ejecutar la aplicación
CMD ["npm", "start"]