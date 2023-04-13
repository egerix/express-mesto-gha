const http2 = require('node:http2');
const CardModel = require('../models/card');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

module.exports.getCards = (req, res, next) => {
  CardModel.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  CardModel.create({ name, link, owner })
    .then((card) => res.status(http2.constants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  CardModel.findOneAndDelete({
    _id: req.params.cardId,
    owner: req.user._id,
  })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError(`Карточка c _id ${req.params.cardId} не найден.`);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужую карточку');
      }
      res.send(card);
    })
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  CardModel.findOneAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError(`Карточка c _id ${req.params.cardId} не найден.`);
      }
      res.send(card);
    })
    .catch((err) => next(err));
};

module.exports.dislikeCard = (req, res, next) => {
  CardModel.findOneAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError(`Карточка c _id ${req.params.cardId} не найден.`);
      }
      res.send(card);
    })
    .catch((err) => next(err));
};
