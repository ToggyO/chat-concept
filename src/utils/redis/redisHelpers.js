/**
 * Описание: Файл содержит функции хелперы для работы с redis
 */
import { redisClient } from 'launch/redis';

const redisHelpers = {};

/**
 * Сохранение в redis произвольного типа данных
 * @param {string} key - ключ для сохранения сущности
 * @param {string|number|array|object} value - сохраняемое значение
 * @returns {Promise}
 */
redisHelpers.serializeAndSet = async (key, value) => {
  await redisClient.set(key, JSON.stringify(value));
};

/**
 * Чтение произвольного типа данных из redis
 * @param {string} key - ключ для получения сущности
 * @param {string|number|array|object} [defaultValue] - возвращаемое значение, если сущность отсутствует в redis
 * @returns {Promise<string|number|array|object>}
 */
redisHelpers.getAndDeserialize = async (key, defaultValue) => {
  let result = defaultValue;
  const serializedValue = await redisClient.get(key);
  if (serializedValue) {
    try {
      result = JSON.parse(serializedValue);
    } catch (error) {
      result = defaultValue;
    }
  }
  return result;
};

/**
 * Удаление в redis произвольного типа данных
 * @param {string} key - ключ для сохранения сущности
 * @returns {Promise}
 */
redisHelpers.delete = async (key) => {
  if (typeof key !== 'string') { return; }
  await redisClient.del(key);
};

/**
 * Получить redis client
 * @returns {object}
 */
redisHelpers.getRedisClient = () => redisClient;

export { redisHelpers };
