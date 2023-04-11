const { CLIENT_ERROR, NOT_FOUND_ERROR, SERVER_ERROR } = require('./statuses');

class DataNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DataNotFound';
  }
}

function handleError(err, res) {
  if (err instanceof DataNotFoundError) {
    res
      .status(NOT_FOUND_ERROR)
      .send({
        message: err.message,
      });
  } else if (err.name === 'ValidationError' || err.name === 'CastError') {
    res
      .status(CLIENT_ERROR)
      .send({
        message: 'Переданы некорректные данные.',
      });
  } else {
    res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на сервере.' });
  }
}

module.exports = {
  DataNotFoundError,
  handleError,
};
