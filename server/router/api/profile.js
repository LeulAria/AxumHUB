const express = require('express')
const router = express.Router()
const passport = require('passport')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// Validation
const validateProfileInput = require('../../validation/profile')
const validateExperianceInput = require('../../validation/experiance')
const validateEducationInput = require('../../validation/education')

// @route  GET api/proifle
// @desc   Get current user profile
// @access Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'Their are no pofiles'
        return res.status(404).json(errors)
      }

      return res.json(profile)
    })
    .catch(err => {
      errors.noprofile = 'Their are no profiles'
      res.status(404).json(errors)
    })
})

// @route  GET api/proifle
// @desc   Get User Profile by handle 
// @access Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name'])
    .then(profile => {
      if (!profile) {
        errors.noprofle = 'Their is no profile for this user';
        return res.status(404).json(errors)
      }

      return res.json(profile)
    })
    .catch(err => {
      console.log(err)
      errors.noprofle = 'Their is no profile for this user';
      return res.status(404).json(errors);
    })
})


// @route  GET api/proifle/user/:user_id
// @desc   Get User profile useing user id
// @access Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'Their is no profile for the user'
        return res.status(404).json(errors)
      }

      return res.json(profile)
    })
    .catch(err => {
      console.log(err)
      errors.noprofile = 'Their is no profile for the user'
      return res.status(404).json(errors)
    })
})



// @route  POST api/proifle
// @desc   create and update profiele
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  if (!isValid)
    return res.status(400).json(errors)

  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  //Skills str-array split
  if (typeof req.body.skills !== 'undefined') {
    let skills = req.body.skills.split(',');
    skills = skills.map(skill => skill.trim())
    profileFields.skills = skills;
  }

  // Social Object
  profileFields.social = {};

  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.twitter) profileFisocial.twitter = req.body.twitter;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        return Profile.findOneAndUpdate({ user: req.user.id },
          { $set: profileFields.handle })
      } else {
        Profile.findOne({ handle: profileFields.handle })
          .then((req, res) => {
            if (profile) {
              errors.handle = 'This profile is already taken';
              return res.status(400).json(errors)
            }
            return new Profile(profileFields).save()
          })
      }
    })
    .then(profile => res.json(profile))
    .catch((err) => {
      console.log(err)
      res.status(400).json(err)
    })
})


// @route  POST api/proifle/experiance
// @desc   create experiance field
// @access Private
router.post('/experiance', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperianceInput(req.body);

  if (!isValid)
    return res.status(400).json(errors)

  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'Pofile not found'
        return res.status(404).json(errors)
      }

      const newExperiance = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      profile.experiance.unshift(newExperiance)

      return profile.save()
    })
    .then(profile => res.json(profile))
    .catch(err => {
      console.log(err)
    })
})

// @route  POST api/proifle/education
// @desc   create education field
// @access Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  if (!isValid)
    res.status(400).json(errors)

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = 'Profile not found for this user';
        res.status(404).json(errors)
      }
      const newEducation = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudyon,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      profile.education.unshift(newEducation)

      return profile.save()
    })
    .then(profile => res.json(profile))
    .catch(err => {
      console.log(err)
      errors.profile = 'Profile not found for this user';
      return res.status.json(errors)
    })
})


// @route  PUT api/profile/experiance/:exp_id
// @desc   Update Experiance Section form profile
// @access Private
router.put('/experiance/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperianceInput(req.body);

  if (!isValid)
    return res.status(400).json(errors)

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ noprofile: 'Use has no Profile Detail' })
      }
      const updateIndex = profile.experiance.map(item => item.id).indexOf(req.params.exp_id)

      profile.experiance[updateIndex] = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      return profile.save()
    })
    .then(profile => res.json(profile))
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ noprofile: 'Use has no Profile Detail' })
    })
})

// @route  PUT api/profile/education/:edu_id
// @desc   Update Education Section form profile
// @access Private
router.put('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  if (!isValid)
    return res.status(400).json(errors)

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ noprofile: 'Use has no Profile Detail' })
      }
      const updateIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

      profile.education[updateIndex] = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudyon,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      return profile.save()
    })
    .then(profile => res.json(profile))
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ noprofile: 'Use has no Profile Detail' })
    })
})


// @route  DELETE api/profile/experiance:exp_id
// @desc   Delete profile experiance detail
// @access Private
router.delete('/experiance/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        res.status(404).json({ noprofile: 'Profile does not exist' })
      }

      const removeIndex = profile.experiance.map(item => item.id).indexOf(req.params.exp_id)

      profile.experiance.splice(removeIndex, 1)
      return profile.save()
    })
    .then(profile => res.json(profile))
    .catch((err) => {
      console.log(err)
      res.status(404).json({ noprofile: 'Profile does not exist' })
    })
})

// @route  DELETE api/profile/education:edu_id
// @desc   Delete profile education detail
// @access Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      if (!profile) {
        res.status(404).json({ noprofile: 'Profile does not exist3' })
      }

      const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

      profile.education.splice(removeIndex, 1)
      return profile.save()
    })
    .then(profile => res.json(profile))
    .catch((err) => {
      console.log(err);
      res.status(404).json({ noprofile: 'Profile does not exist' })
    })
})


// @route  DELETE api/profile/
// @desc   Delete profile info and User
// @access Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      return User.findOneAndRemove({ _id: req.user.id })
    })
    .then(() => res.json({ success: true }))
    .catch(err => {
      console.log(err)
      res.status(404).json({ noprofile: 'Pofile not found' })
    })
})

module.exports = router
