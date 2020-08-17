const express = require('express')
const router = express.Router()

// auth
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const keys = require('../../config/config')
const passport = require('passport')

const upload = require('../../utils/multer-config')
const mediaURI = require("../../server")

// Models
const User = require('../../models/User')
const Profile = require('../../models/Profile')

// Validation 
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// @route  POST api/users/register
// @desc   Register User
// @access Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid)
    return res.status(400).json(errors)

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = 'Email is already taken';
        return res.status(400).json(errors)
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/girl_female_woman_avatar-512.png"
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash;
            newUser.save()
              .then(user => {
                console.log('user data here: ', user)
                res.status(201).json(user)
              })
              .catch(err => {
                console.log(err)
                res.status(500).json(err)
              })
          })
        })
      }
    })
});

// @route  POST api/usrs/login
// @desc   Login | send JWT
// @access Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body)

  if (!isValid)
    return res.status(400).json(errors)

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  let curr_user = null;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return User.findOne({ name })
      }
      return user
    })
    .then(user => {
      if (!user) {
        errors.error = "User not found"
        res.status(404).json(errors)
      }

      curr_user = user;
      return bcrypt.compare(password, user.password)
    })
    .then(isMatch => {
      if (!isMatch) {
        errors.password = 'Incorrect Password'
        return res.status(400).json(errors)
      }

      const payload = {
        id: curr_user.id,
        name: curr_user.name,
        email: curr_user.email,
        avatar: curr_user.avatar
      }

      console.log(payload)
      jwt.sign(
        payload,
        keys.secretOrKey,
        { expiresIn: 604800 },
        (err, token) => {
          if (err) {
            errors.error = 'Token Error..'
            return res.status(500).json(errors)
          }

          Profile.findOne({ user: payload.id }).then((profile) => {
            if (profile) {
              return res.json({ success: true, token: 'Bearer ' + token, user: payload })
            } else {
              const userProfile = new Profile({
                user: payload.id
              })

              userProfile.save().then(() => {
                return res.json({ success: true, token: 'Bearer ' + token, user: payload })
              })
            }
          })
        }
      )
    }).catch(err => {
      console.log(err)
      res.status(400).json({ nouser: 'User not found' })
    })
});

// @route  GET api/users/current
// @desc   Get currently loged in user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})

// @route GET api/users/
router.get('/', (req, res) => {
  User.find().
    select('email avatar name').
    then((users) => res.json(users))
    .catch((err) => {
      console.log(err)
      res.status(400).json(err)
    })
})

router.post('/avatar', passport.authenticate('jwt', { session: false }), upload.single('avatar'), (req, res) => {
  if (req.file.filename)
    User.findById(req.user.id)
      .then((user) => {
        user.avatar = mediaURI + req.file.filename;
        return user.save()
      })
      .then((user) => {
        return res.json({ avatar: user.avatar })
      })
      .catch((err) => {
        res.status(404).json(err)
        console.log(err)
      })
})

module.exports = router