const jwt = require('jsonwebtoken');
const http2 = require('node:http2');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/errors');

module.exports.getUsers = (req, res, next) => {
  UserModel.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  UserModel.findById({ _id: req.params.userId })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(`Пользователь c _id ${req.params.userId} не найден.`);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный формат данных'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => UserModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(http2.constants.HTTP_STATUS_CREATED).send({ user: userObject });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким emal уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(`Некорректные данные пользователя: ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  UserModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Некорректные данные пользователя: ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  UserModel.findByIdAndUpdate(
    { _id: req.user._id },
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  ).then((user) => {
    if (user === null) {
      throw new NotFoundError(`Пользователь c _id ${req.user._id} не найден.`);
    }
    res.send(user);
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Некорректные данные пользователя: ${err.message}`));
    } else {
      next(err);
    }
  });
};

module.exports.updateAvatar = (req, res, next) => {
  UserModel.findByIdAndUpdate(
    { _id: req.user._id },
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(`Пользователь c _id ${req.user._id} не найден.`);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Некорректные данные пользователя: ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ _id: token });
    })
    .catch((err) => next(err));
};
