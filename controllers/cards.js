const CardModel = require('../models/card');
const { DataNotFoundError, handleError } = require('../utils/errors');

module.exports.getCards = (req, res) => {
  CardModel.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handleError(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  CardModel.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
};

module.exports.deleteCard = (req, res) => {
  CardModel.findOneAndDelete({
    _id: req.params.cardId,
    owner: req.user._id,
  })
    .then((card) => {
      if (card === null) {
        throw new DataNotFoundError(`Карточка c _id ${req.params.cardId} не найден.`);
      }
      res.send(card);
    })
    .catch((err) => handleError(err, res));
};

module.exports.likeCard = (req, res) => {
  CardModel.findOneAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new DataNotFoundError(`Карточка c _id ${req.params.cardId} не найден.`);
      }
      res.send(card);
    })
    .catch((err) => handleError(err, res));
};

module.exports.dislikeCard = (req, res) => {
  CardModel.findOneAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new DataNotFoundError(`Карточка c _id ${req.params.cardId} не найден.`);
      }
      res.send(card);
    })
    .catch((err) => handleError(err, res));
};
