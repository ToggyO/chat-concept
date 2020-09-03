/**
 * Описание: Глобальный роутинг приложения по версиям и инициализация моделей
 */
import swaggerUi from 'swagger-ui-express';

import config from '@config';
import {
  createV1Router,
  initializeSwagger,
  initializeModels as initializeV1Models,
} from '@modules/v1/initialize';
import { createRouter as createStaticRouter } from 'modules/v1/static/static.router';

/**
 * Инициализация моделей и роутинга для различных версий приложения
 * @param {object} app - экземпляр приложения
 * @returns {void}
 */
export const run = ({ app }) => {
  initializeV1Models({ app });
  app.use('/', createStaticRouter());
  app.use(config.ROUTE_PREFIX, createV1Router());
  app.use(config.API_URL_PREFIX, swaggerUi.serve, initializeSwagger({ basePath: '/' }));
};
