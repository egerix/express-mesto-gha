const { celebrate, Joi } = require('celebrate');
const urlRegex = require('url-regex')({ exact: true });

module.exports = {
  signin: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),

  signup: celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string()
        .regex(urlRegex)
        .message('поле avatar должно быть url'),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),

  userId: celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),

  me: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),

  avatar: celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required()
        .regex(urlRegex)
        .message('поле avatar должно быть url'),
    }),
  }),

  card: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(urlRegex)
        .message('поле link должно быть url'),
    }),
  }),

  cardId: celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
};
