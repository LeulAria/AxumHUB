const express = require('express')
const router = express.Router()

// auth
const bcrypt = require('bcryptjs')

// Models
const User = require('../../models/User')

// Validation 
const validateRegisterInput = require('../../validation/register')

router.get('/', (req, res) => {
  res.send('user routes...')
})

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
          password: req.body.password
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash;
            newUser.save()
              .then(user => res.status(201).json(user))
              .catch(err => {
                console.log(err)
                res.status(500).json(err)
              })
          })
        })
      }
    })
});

module.exports = router