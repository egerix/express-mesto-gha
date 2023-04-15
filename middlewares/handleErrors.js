const http2 = require('node:http2');

module.exports.handleError = (err, req, res, next) => {
  const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = http2.constants;
  const statusCode = err.statusCode || HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const errMessage = statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Ошибка на сервере.' : err.message;
  res.status(statusCode).send({ message: errMessage });
  next();
};
