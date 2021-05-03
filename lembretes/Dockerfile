#apline: imagem linux "pequena"
FROM node:alpine

# um diretório no sistema de arquivos do contêiner para os comandos a seguir
WORKDIR /app

#copiamos o package.json para poder executar npm install
COPY package.json .

#executamos npm install
RUN npm install

#copia todo o conteúdo .local para a imagem
COPY . .

#executa quando o contêiner entrar em execução
CMD ["npm", "start"]