const express = require('express')
const router = express.Router()
const axios = require('axios')

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
        errors.error = 'Email is already taken';
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

// @route  POST api/users/login
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
        throw newError(res.status(404).json(errors))
      }

      curr_user = user;
      return bcrypt.compare(password, user.password)
    })
    .then(isMatch => {
      if (!isMatch) {
        errors.error = 'Incorrect Password'
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
      res.status(400).json({ error: 'user no found!' })
    })
});

// @route  GET api/users/current
// @desc   Get currently logged in user
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

// @route  POST api/users/etp
// @desc   Sign In With ETP
// @access Public
router.post("/etp", async (req, res) => {
  const code = req.body.code;

  if (!code) return res.status(400).json({ detail: "There is no code" });

  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.ETP_URL}/o/token/`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=authorization_code&code=${code}`,
    });

    let config = {
      headers: { Authorization: `Bearer ${response.data.access_token}` },
    };

    const user_response = await axios.get(
      `${process.env.ETP_URL}/api/users/o/userinfo/`,
      config
    );

    const data = user_response.data;

    const user = await User.findOne({ email: data.email });

    if (user) {
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 604800 }, (err, token) => {
        if (err) {
          errors.error = "Token Error..";
          return res.status(500).json(errors);
        }

        Profile.findOne({ user: user.id }).then(() => {
          return res.json({
            success: true,
            token: "Bearer " + token,
            user: payload,
          });
        });
      });
    } else {
      const newUser = new User({
        name: data.username,
        email: data.email,
        password: data.uuid,
        avatar: data.picture,
      });
      await newUser.save();
      const payload = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar
      }
      jwt.sign(payload, keys.secretOrKey, { expiresIn: 604800 }, (err, token) => {
        if (err) {
          return res.status(500).json({ detail: "Token Error." });
        }

        Profile.findOne({ user: newUser.id }).then((profile) => {
          if (profile) {
            return res.json({
              success: true,
              token: "Bearer " + token,
              user: payload,
            });
          } else {
            const userProfile = new Profile({
              user: newUser.id,
            });

            userProfile.save().then(() => {
              return res.json({
                success: true,
                token: "Bearer " + token,
                user: payload,
              });
            });
          }
        });
      });
    }
  } catch (er) {
    if (er.response) {
      return res.status(400).json(er.response.data);
    }
    return res.status(400).json(er);
  }
});

module.exports = router