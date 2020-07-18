const express = require('express')
const router = express.Router()
const passport = require('passport')
const QuestionPost = require('../../models/QuestionPost')

// Validation
const validateQuestionPostInput = require('../../validation/question_post')
const validateQuestionAnswerInput = require('../../validation/question_answer')

// @route  GET api/question_post
// @desc   Simple test for route
// @access Public
router.get('/', (req, res) => {
  res.json({ msg: 'this is questions post route' })
})

// @route  GET api/question_post/all
// @desc   Get all question posts
// @access Public
router.get('/all', (req, res) => {
  QuestionPost.find()
    .populate('user', ['name'])
    .sort({ date: -1 })
    .then(questions => {
      if (!questions) {
        res.status(400).json({ noquestions: 'No Questions Foud...' })
      }

      res.json(questions)
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({ noquestions: 'No Questions Foud...' })
    })
})

// @route  Get api/question_post/:id
// @desc   Get single post item by id
// @access Publit
router.get('/:id', (req, res) => {
  QuestionPost.findById(req.params.id)
    .populate('user', ['name'])
    .then(question => {
      if (!question) {
        return res.status(404).json({ nopost: "Question post not found" })
      }
      res.json(question)
    })
    .catch(err => {
      console.log(err)
      return res.status(404).json({ nopost: "Question post not found" })
    })
})


// @route  Post api/question_post/create
// @desc   Ceate a new Question Post
// @access Private
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateQuestionPostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors)
  }

  const newQuestionPost = new QuestionPost({
    user: req.user.id,
    title: req.body.title,
    description: req.body.description,
    tags: req.body.tags && req.body.tags.split(',').map(tag => tag.trim())
  })

  newQuestionPost.save()
    .then((question) => res.json(question))
    .catch((err) => {
      console.log(err)
      res.status(400).json(err)
    })
})


// @route  Post api/question_post/like/:id
// @desc   Like a post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  QuestionPost.findById(req.params.id)
    .then(question => {
      if (!question) {
        return res.status(404).json({ nopost: 'Question post not found' })
      }

      if (question.likes.filter(like => like.user.toString() == req.user.id).length > 0) {
        return res.status(400).json({ alreadyLiked: 'User already liked the post' })
      }

      question.likes.unshift({ user: req.user.id })
      return question.save()
    })
    .then((post) => res.json(post))
    .catch((err) => {
      console.log(err)
    })
})

// @route  Post api/question_post/unlike/:id
// @desc   Unlike a post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  QuestionPost.findById(req.params.id)
    .then(question => {
      if (!question) {
        return res.status(404).json({ nopost: 'Question post not found' })
      }

      if (question.likes.filter(like => like.user.toString() == req.user.id).length === 0) {
        return res.status(400).json({ notliked: 'you have not liked this post' })
      }

      const removeItem = question.likes.map(likes => likes.user.id.toString()).indexOf(req.user.id);

      question.likes.splice(removeItem, 1);
      return question.save()
    })
    .then((post) => res.json(post))
    .catch((err) => {
      console.log(err)
      return res.status(404).json({ nopost: 'Question post not found' })
    })
})

// @route  Post api/question_post/answer/:id
// @desc   Answer on a post
// @access Private
router.post('/answer/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateQuestionAnswerInput(req.body)

  if (!isValid) {
    return res.status(400).json(errors)
  }

  QuestionPost.findById(req.params.id)
    .then(question => {
      if (!question) {
        return res.status(404).json({ nopost: 'Question post not found' })
      }

      const newAnswer = {
        user: req.user.id,
        answer: req.body.answer,
      }

      question.answers.unshift(newAnswer);
      return question.save()
    })
    .then((post) => res.json(post))
    .catch((err) => {
      console.log(err)
      return res.status(404).json({ nopost: 'Question post not found' })
    })
})


// @route  Delete api/question_post/:id/answer/:answer
// @desc   Delete Answer on a post
// @access Private
router.delete('/:id/answer/:answer_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  QuestionPost.findById(req.params.id)
    .then((question) => {
      if (!question)
        return res.status(404).json({ nopost: 'Post not found' })

      if (question.answers.filter(answer => answer._id.toString() === req.params.answer_id).length === 0)
        return res.status(404).json({ noanswer: 'answer not found' })

      const removeIndex = question.answers.map(item => item._id.toString()).indexOf(req.params.answer_id)

      console.log(removeIndex)
      if (question.answers[removeIndex].user.toString() !== req.user.id) {
        return res.status(403).json({ unauthorized: 'User not authorized to delete' })
      }

      question.answers.splice(removeIndex, 1)
      return question.save()
    })
    .then((question) => res.json(question))
    .catch(err => {
      console.log(err)
      res.status(404).json({ noquestion: 'Question not found' })
    })
})


// @route  Delete api/question_post/:id
// @desc   Delete Question
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  QuestionPost.findById(req.params.id)
    .then(question => {
      if (!question)
        return res.status(404).json({ noquestion: 'Question not found' })
      if (question.user.toString() !== req.user.id) {
        return res.status(403).json({ unauthorized: 'User not authorized to delete' })
      } else {
        return question.remove()
      }
    })
    .then(() => res.json({ success: true }))
    .catch((err) => {
      console.log(err)
      res.status(400).json({ noquestion: 'Question not found' })
    })
})

module.exports = router