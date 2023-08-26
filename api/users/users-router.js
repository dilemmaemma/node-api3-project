const express = require('express');
const {
  validateUserId,
  validateUser,
  validatePost,
} = require('../middleware/middleware')

const User = require('./users-model')
const Post = require('../posts/posts-model')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  User.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  User.insert({name: req.name})
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  User.update(req.params.id, {name: req.name})
    .then(() => {
      return User.getById(req.params.id)
    .then(updatedUser => {
      res.status(200).json(updatedUser)
    })
    })
    .catch(next)
});

router.delete('/:id', validateUserId,  async (req, res, next) => {
  try {
    await User.remove(req.params.id)
    res.status(200).json(req.user)
  } catch(err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const result = await User.getUserPosts(req.params.id)
    res.status(200).json(result)
  } catch(err) {
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  try {
    const result = await Post.insert({
      user_id: req.params.id,
      text: req.text
    })
    res.status(201).json(result)
  } catch(err) {
    next(err)
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: 'sowwy something twagic happened owo',
    message: err.message,
    stack: err.stack,
  })
})

module.exports = router
