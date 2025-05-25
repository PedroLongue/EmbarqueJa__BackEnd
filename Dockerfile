FROM node:20

WORKDIR /app

# Copia apenas os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Agora sim copia o restante (sem incluir node_modules)
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
