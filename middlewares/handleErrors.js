const http2 = require('node:http2');

module.exports.handleError = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res
      .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
      .send({
        message: 'Переданы некорректные данные.',
      });
  } else {
    const errMessage = err.statusCode === http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Ошибка на сервере.' : err.message;
    res.status(
      err.statusCode || http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    ).send({ message: errMessage });
  }
  next();
};
