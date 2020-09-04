/**
 * Описание: Конфигурация приложения и поключение к внешним зависимостям
 */
import { init as initAxios } from '@utils/network/axiosClient';
import * as common from './common';
import * as db from './db';
import * as modules from './modules';
import * as deferredTasks from './deferredTasks';
import * as errorHandler from './errorHandler';
import * as socket from './socket';
// import * as redis from './redis';

/**
 * Инициализация приложения. Подключение к внешним зависимостям.
 * @param {object} app - экземпляр приложения
 * @returns {Promise<void>}
 */
export default async ({ app, server }) => {
  common.run({ app });
  await db.run({ app });
  // await redis.run({ app });
  await socket.run({ server });
  modules.run({ app });
  initAxios({ app });
  await deferredTasks.run({ app });
  errorHandler.run({ app });
};
