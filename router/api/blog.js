const express = require('express')
const router = express.Router()
const upload = require('../../utils/multer-config')
const passport = require('passport')
const Blog = require('../../models/Blog')

// validators
const validateBlogInput = require('../../validation/blog')

router.get('/all', (req, res) => {
  Blog.find()
    .populate('author', ['name'])
    .then(blog => {
      if (!blog)
        res.status(404).json({ noblog: "No Blog found" })
      res.json(blog)
    })
    .catch(err => {
      console.log(err)
      res.status(404).json({ noblog: "No Blog found" })
    })
})

router.get('/user_blogs', passport.authenticate('jwt', { session: false }), (req, res) => {
  Blog.find({ author: req.user.id })
    .populate('author', ['name'])
    .then(blog => {
      if (!blog)
        res.status(404).json({ noblog: "No Blog found" })
      res.json(blog)
    })
    .catch(err => {
      console.log(err)
      res.status(404).json({ noblog: "No Blog found" })
    })
})


module.exports = router