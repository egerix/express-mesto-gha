const routes = require('express').Router();
const { errors } = require('celebrate');
const http2 = require('node:http2');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { handleError } = require('../middlewares/handleErrors');
const validators = require('../utils/validators');

routes.post('/signin', validators.signin, login);
routes.post('/signup', validators.signup, createUser);

routes.use(auth);

routes.use('/users', require('./users'));
routes.use('/cards', require('./cards'));

routes.use((req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Неверный маршрут. 404' });
});

routes.use(errors());
routes.use(handleError);

module.exports = { routes };
