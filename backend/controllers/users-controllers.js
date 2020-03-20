const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const HttpError = require('../model/http-error');
const User = require('../model/user');
const config = require('config');
const jwtKey = config.get('JWT_KEY');
var cloudinary = require('../uploads/cloudinary');

// Test end points for friend request

const sendFriendRequest = async (req, res, next) => {
  console.log(req.params.pid);
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const acceptFriendRequest = async (req, res, next) => {
  const friendsList = [
    {
      userId: '5e6a513120056326449f4a9b',
      name: 'yalcin',
      email: 'yalcintok33@gmail.com',
      image: 'uploads\\images\\c92715e0-6473-11ea-a5a1-c924751ffc0a.jpeg',
    },
    {
      userId: '5e73a9760c11ff36ec3117c5',
      name: 'ufuk',
      email: 'test@gmail.com',
      image:
        'http://res.cloudinary.com/dqxb7twea/image/upload/v1584638326/sjeocmsoxbyrybvapfgc.jpg',
    },
  ];

  const receivedFriendRequest = [
    {
      userId: '5e7391980c11ff36ec3117be',
      name: 'yalcin',
      email: 'origami39@gmail.com',
      image:
        'http://res.cloudinary.com/dqxb7twea/image/upload/v1584632214/rrsfngemkorh4f2bsokj.jpg',
    },
  ];
  const sentFriendRequest = [
    {
      userId: '5e73f9420c11ff36ec3117c9',
      name: 'haydar',
      email: 'test2@gmail.com',
      image:
        'http://res.cloudinary.com/dqxb7twea/image/upload/v1584658754/c5wty72gpraaaopzak8j.jpg',
    },
  ];
  console.log(req.params.pid);
  console.log(req.userData.userId);

  // Get remove index
  const removeIndex = receivedFriendRequest.map(user => user.userId).indexOf(req.params.pid);
  console.log({ removeIndex });
  const accepted = receivedFriendRequest[removeIndex];
  receivedFriendRequest.splice(removeIndex, 1);

  friendsList.push(accepted);
  console.log({ receivedFriendRequest });
  console.log({ friendsList });
  const user = await User.findById(req.userData.userId);
  console.log({ user });
  res.status(201).json({
    userId: req.userData.userId,
    email: user.email,
    image: user.image,
    // We want this response for friend request
    friendStatus: { friendsList, receivedFriendRequest, sentFriendRequest },
  });
};

const cancelFriendRequest = async (req, res, next) => {
  console.log(req.params.pid);
};

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, '-password');
  } catch (error) {
    return next(new HttpError('Fetching users failed, please try again later.', 500));
  }
  res.status(200).json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty())
    return next(new Error('Invalid input passed, please check your data.', 422));
  const { name, email, password } = req.body;
  let createdUser;
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) return next(new HttpError('User exists already, please login instead.', 422));
    // upload the image first to the cloudinary than I saved the image url on mongodb
    const result = await cloudinary.uploader.upload(req.file.path);

    createdUser = new User({
      name,
      email,
      image: result.url,
      password,
      places: [],
    });

    await createdUser.save();
  } catch (error) {
    return next(new HttpError('Signin up  failed, please try again later.', 500));
  }
  let token;
  try {
    token = jwt.sign({ userId: createdUser.id, email: createdUser.email, token }, jwtKey, {
      expiresIn: '1h',
    });
  } catch (error) {
    return next(new HttpError('Signing up failed, please try agein later', 500));
  }
  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const friendsList = [
    {
      userId: '5e6a513120056326449f4a9b',
      name: 'yalcin',
      email: 'yalcintok33@gmail.com',
      image: 'uploads\\images\\c92715e0-6473-11ea-a5a1-c924751ffc0a.jpeg',
    },
    {
      userId: '5e73a9760c11ff36ec3117c5',
      name: 'ufuk',
      email: 'test@gmail.com',
      image:
        'http://res.cloudinary.com/dqxb7twea/image/upload/v1584638326/sjeocmsoxbyrybvapfgc.jpg',
    },
  ];

  const receivedFriendRequest = [
    {
      userId: '5e7391980c11ff36ec3117be',
      name: 'yalcin',
      email: 'origami39@gmail.com',
      image:
        'http://res.cloudinary.com/dqxb7twea/image/upload/v1584632214/rrsfngemkorh4f2bsokj.jpg',
    },
  ];
  const sentFriendRequest = [
    {
      userId: '5e73f9420c11ff36ec3117c9',
      name: 'haydar',
      email: 'test2@gmail.com',
      image:
        'http://res.cloudinary.com/dqxb7twea/image/upload/v1584658754/c5wty72gpraaaopzak8j.jpg',
    },
  ];

  let existingUser;
  try {
    existingUser = await User.findBuCredantials(email, password);
  } catch (error) {
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser.id, email: existingUser.email, token }, jwtKey, {
      expiresIn: '1h',
    });
  } catch (error) {
    return next(new HttpError('Loggin in failed, please try agein later', 500));
  }
  res.status(201).json({
    userId: existingUser.id,
    email: existingUser.email,
    token,
    // We want this response for friend request
    friendStatus: { friendsList, receivedFriendRequest, sentFriendRequest },
  });
};

// we added friend request methods
module.exports = {
  getUsers,
  signup,
  login,
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
};
