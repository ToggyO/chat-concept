/**
 * Описание: Файл содержит роутинг для модуля статических файлов
 */
import { Router } from 'express';

import { asyncWrapper } from '@utils/helpers';

/**
 * Роутер: Static
 */
export const createRouter = () => {
  const router = Router();

  router.get('/', asyncWrapper((req, res) => {
    res.render('index.hbs');
  }));

  return router;
};
