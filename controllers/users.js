const UserModel = require('../models/user');
const {handleError, DataNotFoundError} = require("../utils/errors");

module.exports.getUsers = (req, res, next) => {
  UserModel.find({})
    .then((users) => res.send(users))
    .catch(err => handleError(err, res, next));
}

module.exports.getUserById = (req, res) => {
  UserModel.findById({_id: req.params.userId})
    .then((user) => {
      if (user === null) {
        throw new DataNotFoundError(`Пользователь c _id ${req.params.userId} не найден.`)
      }
      res.send(user);
    })
    .catch(err => handleError(err, res));
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  UserModel.create({name, about, avatar})
    .then((user) => {
      res.send(user);
    })
    .catch(err => handleError(err, res));
}


module.exports.updateUser = (req, res) => {
  UserModel.findByIdAndUpdate(
    {_id: req.user._id},
    {name: req.body.name, about: req.body.about},
    { new: true, runValidators: true },
  ).then((user) => {
    if (user === null) {
      throw new DataNotFoundError(`Пользователь c _id ${req.user._id} не найден.`)
    }
    res.send(user);
  })
    .catch(err => handleError(err, res));
}

module.exports.updateAvatar = (req, res) => {
  UserModel.findByIdAndUpdate(
    {_id: req.user._id},
    {avatar: req.body.avatar},
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new DataNotFoundError(`Пользователь c _id ${req.user._id} не найден.`)
      }
      res.send(user);
    })
    .catch(err => handleError(err, res));
}

