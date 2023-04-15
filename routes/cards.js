const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const validators = require('../utils/validators');

router.get('/', getCards);

router.delete('/:cardId', validators.cardId, deleteCard);

router.post('/', validators.card, createCard);

router.put('/:cardId/likes', validators.cardId, likeCard);

router.delete('/:cardId/likes', validators.cardId, dislikeCard);

module.exports = router;
