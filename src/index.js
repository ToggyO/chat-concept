/**
 * Описание: Корневой файл приложения
 */
import http from 'http';
import express from 'express';

import config from './config';
import launch from './launch';

/**
 * Функция инициализирующая приложения
 * @returns {function}
 */
export const init = (async () => {
  const app = express();
  const server = http.createServer(app);

  try {
    await launch({ app, server });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  const { PORT, HOST, NODE_ENV } = config;

  server.listen({ port: PORT, host: HOST }, () => {
    app.get('log').info(`Server running at http://${HOST}:${PORT}, in ${NODE_ENV} mode. `
			+ `Swagger: http://${HOST}:${PORT}${config.API_URL_PREFIX}`);
  });

  return app;
})();
