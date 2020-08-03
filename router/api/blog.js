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

router.get('/user/:id', (req, res) => {
  Blog.find({ author: req.params.id })
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

router.post('/create', passport.authenticate('jwt', { session: false }), upload.single('blogImage'), (req, res) => {
  const { errors, isValid } = validateBlogInput(req.body);
  if (!isValid) {
    console.log(errors)
    res.status(400).json(errors)
  }



  console.log('image file name: ....: ', req.file.filename)

  const newBlog = new Blog({
    author: req.user.id,
    title: req.body.title,
    body: req.body.body,
    slug: req.body.slug,
    tags: req.body.tags.split(',').map(tag => tag.trim()),
    blogimage: req.file ? req.file.filename : 'default_image.png'
  })

  newBlog.save()
    .then(blog => {
      console.log('the blog=++++++: ', blog)
      Blog.findById(blog.id)
        .populate('author', ['name'])
        .then(blog => res.json(blog))
    })
    .catch(err => {
      console.log(err)
      res.status(400).json(err)
    })
})


router.put('/:id', passport.authenticate('jwt', { session: false }), upload.single('blogImage'), (req, res) => {
  const { errors, isValid } = validateBlogInput(req.body);
  if (!isValid) {
    console.log(errors)
    res.status(400).json(errors)
  }
  req.body.blogimage = req.file && req.file.filename || undefined;

  Blog.findById(req.params.id)
    .then(blog => {
      if (!blog)
        res.status(404).json({ noblog: "Blog not found" })
      if (!blog.author === req.user.id)
        res.status(403).json({ unauthorized: "User not authorized" })

      return Blog.findByIdAndUpdate(req.params.id, req.body)
    })
    .then((blog) => {
      Blog.findById(blog)
        .populate('author', ['name'])
        .then(blog => res.json(blog))
    })
    .catch((err) => {
      console.log(err)
      res.status(404).json({ noblog: "Blog not found" })
    })
})


router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Blog.findById(req.params.id)
    .then(blog => {
      if (!blog)
        res.status(404).json({ noblog: "Blog not found" })
      if (!blog.author === req.user.id)
        res.status(403).json({ unauthorized: "User not authorized" })

      return Blog.findByIdAndRemove(req.params.id, req.body)
    })
    .then((blog) => res.json({ Success: true }))
    .catch((err) => {
      console.log(err)
      res.status(404).json({ noblog: "Blog not found" })
    })
})

module.exports = router