const express = require('express');
const { check } = require('express-validator');
const route = express.Router();

const usersControllers = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

route.get('/', usersControllers.getUsers);

route.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  usersControllers.signup,
);

route.post('/login', usersControllers.login);

route.use(checkAuth);
// For test we added these
route.post('/send/:pid', usersControllers.sendFriendRequest);
route.put('/send/:pid', usersControllers.acceptFriendRequest);
route.delete('/send/:pid', usersControllers.cancelFriendRequest);

module.exports = route;
