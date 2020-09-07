## Simple chat

#### Used technologies
- [Node.js](https://nodejs.org)
- [Nodemon](https://nodemon.io)
- [Express.js](https://expressjs.com)
- [Sequelize.js](https://sequelize.org)
- [PostgreSQL 12.x](https://www.postgresql.org)
- [Babel](https://github.com/babel/babel)
- [Socket.io](https://socket.io)
- [Swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
- [Swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- [Docker 18.09.x](https://www.docker.com)
- [Docker Compose 3.x](https://docs.docker.com/compose)
- [Nginx 1.19.x](https://nginx.org)

#### Coding style
- [Eslint](https://eslint.org/)

#### Development
Preparation:
1. `npm install` - to install packages;
2. `. start_db_dev.sh` - to run database in docker container;
3. `. db-migrate.sh` - to create database migrations.

Start development server:
1. Open new terminal window and run `npm run dev` - to start development server.


#### Production
Run:
- `. start_prod.sh` - to start production server.

Production domain:
- `example.localhost:8080`

Soon... need to configure Nginx
