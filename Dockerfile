# Imagem utilizada do Node
FROM node:latest

# Diretório do Container que iremos executar KKKKKKKKKKKteamo
WORKDIR /app

# Copua
COPY package.json package-lock.json ./
# Instala as dependencies
RUN npm install
# Copia tudo do repositório pra /app
COPY . .

# Expõe a porta 5000
EXPOSE 5000

# Roda o arquivo
CMD ["npm", "run", "dev"]