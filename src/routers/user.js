const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const route = new express.Router();
const multer = require('multer');
const sharp = require('sharp');

route.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

route.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredential(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

route.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

route.post('/users/logoutAll', auth, async (req, res) => {
  try {
    console.log(req.user.tokens.length);
    if (!!req.user.tokens.length) {
      req.user.tokens = [];
    }
    await req.user.save();
    res.send('logout from everywhere');
  } catch (e) {
    res.status(500).send(e);
  }
});

route.get('/users/me', auth, async (req, res) => {
  res.status(201).send(req.user);
});

route.get('/users', auth, async (req, res) => {
  try {
    const result = await User.find({});
    await res.status(201).send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

// route.get('/users/:id', async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const result = await User.findById(_id);
//     if (!result) res.status(404).send(result);
//     res.status(200).send(result);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

route.patch('/users/me', auth, async (req, res) => {
  //handle for property doe't exit in model
  const getKeyFromObject = Object.keys(req.body);
  const allowedData = ['name', 'age', 'email', 'password'];
  const isValidData = getKeyFromObject.every((update) => allowedData.includes(update));

  if (!isValidData) {
    return res.status(400).send({ error: 'invalid data' });
  }
  try {
    const data = req.user;
    getKeyFromObject.forEach((update) => (data[update] = req.body[update]));
    req.user.save();
    res.send(data);
  } catch (e) {
    res.status(500).send(e);
  }
});

route.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send({ data: req.user, message: 'deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

const avatar = multer({
  limits: { files: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('please upload image file'));
    }
    console.log('avatar', req);
    cb(undefined, true);
  },
});

route.post(
  '/user/me/avatar',
  auth,
  avatar.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

route.delete('/user/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send('deleted!!');
});

route.get('/user/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user | !user.avatar) {
      throw new Error('image or user not found');
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = route;
