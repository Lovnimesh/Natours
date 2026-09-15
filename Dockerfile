FROM node:20-alpine

WORKDIR /app

# Copy only packages files first(Docker caching optimization - 
# npm install only re-runs if these file channge, not on every code edit)
COPY package*.json ./

RUN npm install --production
# --production skips devDependecies like nodemon - we don'tneed them in the container

# Now copy everything else: controllers/, dev-data/, routes/, public/, app.js, server.js, config.env
COPY . .

EXPOSE 8000
# 3000 port is the port where my app is listens on

CMD ["node", "server.js"]