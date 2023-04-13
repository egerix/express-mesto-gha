const http2 = require('node:http2');

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = http2.constants.HTTP_STATUS_NOT_FOUND;
  }
};
