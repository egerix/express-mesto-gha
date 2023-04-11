const routes = require('express').Router();
const { NOT_FOUND_ERROR } = require('../utils/statuses');

routes.use('/users', require('./users'));
routes.use('/cards', require('./cards'));

routes.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Неверный маршрут. 404' });
});

module.exports = { routes };
