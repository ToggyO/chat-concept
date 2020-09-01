/**
 * Описание: конфиг для корректной работы команды миграции и seed для sequelize-cli
 */
import config from '@config';

module.exports = {
  development: {
    username: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    database: config.POSTGRES_DATABASE,
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_EXTERNAL_PORT,
    dialect: 'postgres',
  },
  production: {
    username: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    database: config.POSTGRES_DATABASE,
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_EXTERNAL_PORT,
    dialect: 'postgres',
  },
};
