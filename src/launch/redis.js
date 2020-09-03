/**
 * Описание: Инициализация редис клиента
 */
import redis from 'async-redis';

import config from 'config';
import { ApplicationError } from 'utils/response';
// import { redisHelpers } from '../utils/redis/redisHelpers';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = config;

// export const redisClient = redis.createClient({
//   host: REDIS_HOST,
//   port: REDIS_PORT,
//   password: REDIS_PASSWORD,
// });

export const run = async ({ app }) => {
  try {
    redisClient.on('error', function (err) {
      console.log('Error ' + err);
    });

    redisClient.on('connect', function() {
      console.log('Connected to Redis');
    });

    // await redisHelpers.serializeAndSet('foo', 'bar');
    // const result = await redisHelpers.getAndDeserialize('foo');
    // console.log(result);
  } catch (error) {
    throw new ApplicationError({
      statusCode: 500,
      errorCode: 'brown',
      errorMessage: 'Not connected',
      errors: [],
    });
  }
};
