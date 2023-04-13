const router = require('express').Router();
const {
  getUsers, getUserById, getCurrentUser, updateAvatar, updateUser,
} = require('../controllers/users');
const validators = require('../utils/validators');

router.get('/', getUsers);
router.get('/me', validators.userId, getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', validators.me, updateUser);
router.patch('/me/avatar', validators.avatar, updateAvatar);

module.exports = router;
