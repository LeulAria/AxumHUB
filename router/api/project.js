const express = require('express')
const router = express.Router()
const passport = require('passport')
const Project = require('../../models/Project')
const ChatGroup = require('../../models/ChatGroup')

const upload = require('../../utils/multer-config')
const mediaURI = require("../../server")

// Validation
const validateProjectInput = require('../../validation/project')

// @route  GET api/question_post/all
// @desc   Get all question posts
// @access Public
router.get('/all', (req, res) => {
  Project.find()
    .populate('admins', ['name'])
    .populate('contributers', ['name'])
    .populate({
      path: 'joinrequests',
      populate: [
        {
          path: 'userid',
          model: 'user',
          select: '_id name'
        },
        {
          path: 'projectid',
          model: 'project',
          select: '_id title'
        }
      ]
    })
    .sort({ date: -1 })
    .then(projects => {
      if (!projects) {
        res.status(400).json({ projects: 'No Questions Foud...' })
      }

      res.json(projects)
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({ noquestions: 'No Questions Foud...' })
    })
})


// @route  Get api/question_post/:id
// @desc   Get user projects
// @access Public
router.get('/user_projects/:id', (req, res) => {
  Project.find({ author: req.params.id })
    .populate({
      path: 'joinrequests',
      populate: [
        {
          path: 'userid',
          model: 'user',
          select: '_id name'
        },
        {
          path: 'projectid',
          model: 'project',
          select: '_id title'
        }
      ]
    })
    .then(projects => res.json(projects))
    .catch(err => {
      console.log(err)
      res.status(400).json()
    })
})


// @route  Get api/project/:id
// @desc   Get user joined projects
// @access Public
router.get('/joined', passport.authenticate('jwt', { session: false }), (req, res) => {
  const joinedProjects = [];
  Project.find({ admins: req.user.id })
    .then(projects => {
      projects.forEach(project => {
        if (project.author.toString() != req.user.id) {
          joinedProjects.push(project)
        }
      })
      return Project.find({ contributers: req.user.id })
    })
    .then((projects => {
      projects.forEach(project => {
        if (project.auther !== req.user.id) {
          joinedProjects.push(project)
        }
      })
      return res.json(joinedProjects)
    }))
    .catch(err => {
      console.log(err)
      res.status(400).json()
    })
})


// @route  Get api/poject/:id
// @desc   Get single post item by id
// @access Public
router.get('/:id', (req, res) => {
  Project.findById(req.params.id)
    .populate('author', ['name', 'avatar', 'email'])
    .populate('contributers', ['name', 'avatar', 'email'])
    .populate('admins', ['name', 'avatar', 'email'])
    .populate({
      path: 'uploads',
      populate: [{
        path: 'userid',
        model: 'user'
      }]
    })
    .then(project => {
      if (!project) {
        return res.status(404).json({ nopost: "Project not found" })
      }
      res.json(project)
    })
    .catch(err => {
      console.log(err)
      return res.status(404).json({ nopost: "Project not found" })
    })
})

router.get("/chat/:chatgroupname", passport.authenticate("jwt", { session: false }), (req, res) => {
  Project.findOne({ chatgroupname: req.params.chatgroupname })
    .populate("contributers", ["name", "avatar"])
    .populate("admins", ["name", "avatar"])
    .populate("chatgroup", ["name", "chats"])
    .then((project) => {
      if (!project) {
        return res.status(404).json({ nopost: "Project not found" })
      }
      if (!isFound(project.admins, req.user.id) && !isFound(project.contributers, req.user.id)) {
        return res.status(403).json({ nouser: "User hasn't been found in the project group" })
      }

      res.json(project)
    })
    .catch(err => {
      console.log(err)
      return res.status(404).json({ nopost: "Projct not found" })
    })
})


// @route  Post api/project/create
// @desc   Ceate a new Question Post
// @access Private
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProjectInput(req.body);

  if (!isValid) {
    console.log('error occured: ', errors)
    return res.status(400).json(errors)
  }

  const newProject = new Project({
    author: req.user.id,
    admins: [req.user.id],
    title: req.body.title,
    summary: req.body.summary,
    version: req.body.version,
    licence: req.body.licence,
    developmentmodel: req.body.developmentmodel,
    tools: req.body.tools && req.body.tools.split(',').map(tag => tag.trim()),
    website: req.body.website,
    githubrepolink: req.body.githubrepolink,
    createchatgroup: req.body.createchatgroup,
    chatgroupname: req.body.chatgroupname
  })

  let newGroup = null;
  console.log(typeof req.body.createchatgroup, req.body.createchatgroup)
  if (req.body.createchatgroup) {
    console.log('new grup created.......')
    newGroup = new ChatGroup({
      name: req.body.chatgroupname,
      project: newProject._id
    })
    newProject.chatgroup = newGroup._id;
  }

  newProject.save()
    .then((project) => {
      if (project) {
        if (newGroup) {
          console.log('their is group')
          return newGroup.save()
        }
        else
          return res.json(project)
      }
      else {
        throw new Error("Project hasn't been created")
      }
    })
    .then((chatgroup) => {
      if (chatgroup)
        res.json(newProject)
      else
        throw new Error("Project hasn't been created")
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json(err)
    })
})

// @route  GET api/project/:id/admins
// @desc   Get all admins of the project
// @access Public
router.get('/:id/admins', (req, res) => {
  Project.findById(req.params.id)
    .populate('admins', ['name'])
    .then((project) => {
      if (!project)
        res.status(404).json({ noproject: 'No project found' })
      res.json(project.admins)
    })
    .catch(err => {
      console.log(err)
      res.status(400).json(err)
    })
})

// @route  GET api/project/:id/contributers
// @desc   Get all contributers of the project
// @access Public
router.get('/:id/contributers', (req, res) => {
  Project.findById(req.params.id)
    .populate('contributers', ['name', 'email'])
    .then((project) => {
      if (project)
        res.status(404).json({ noproject: 'No project found' })
      res.json(project.contributers)
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json(err)
    })
})


// @route  Post api/project/:id/apply
// @desc   create new project
// @access Private
router.post('/:id/apply', passport.authenticate('jwt', { session: false }), (req, res) => {
  Project.findById(req.params.id)
    .then((project) => {
      if (!project)
        return res.status(404).json({ noproject: 'Project not found' })
      if (project.joinrequests.includes(req.user.id))
        return res.status(400).json({ applied: 'User already applied' })

      project.joinrequests.push({ userid: req.user.id, projectid: req.params.id })
      return project.save()
    })
    .then(() => {
      Project.findById(req.params.id)
        .then((project) => {
          res.json(project)
        })
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json(err)
    })
})


// @route  GET api/project/:id/applicants
// @desc   Get applicant users to join project
// @access Private
router.get('/:id/applicants', passport.authenticate('jwt', { session: false }), (req, res) => {
  Project.findById(req.params.id)
    .populate('joinrequests', ['name', 'email'])
    .then((project) => {
      if (!project)
        res.status(404).json({ noproject: 'Project not found' })
      if (!isFound(project.admins, req.user.id))
        res.status(403).json({ unauthorized: 'User not authorized.' })

      res.json(project.joinrequests)
    })
    .catch(err => {
      console.log(err)
      res.status(400).json(err)
    })
})

// @route  POST api/project/:id
// @desc   accept a user to join the group
// @access Private
router.post('/:id/user/:user_id/accept', passport.authenticate('jwt', { session: false }), (req, res) => {
  Project.findById(req.params.id)
    .then((project) => {
      if (!project)
        res.status(404).json({ noproject: 'Project not found' })
      if (!isFound(project.admins, req.user.id))
        res.status(403).json({ unauthorized: 'User not authorized.' })
      const user = project.joinrequests.indexOf(req.params.user_id)
      if (user == -1)
        res.status(400).json({ notfound: 'User not found' })
      project.joinrequests.splice(user, 1);
      project.contributers.push(req.params.user_id)
      return project.save()
    })
    .then((project) => {
      Project.findById(req.params.id)
        .then(project => res.json(project))
    })
    .catch(err => {
      console.log(err)
      res.status(400).json(err)
    })
})

// @route  POST api/project/:id
// @desc   accept a user to join the group
// @access Private
router.post('/:id/user/:user_id/reject', passport.authenticate('jwt', { session: false }), (req, res) => {
  Project.findById(req.params.id)
    .then((project) => {
      if (!project)
        res.status(404).json({ noproject: 'Project not found' })
      if (!isFound(project.admins, req.user.id))
        res.status(403).json({ unauthorized: 'User not authorized.' })
      const user = project.contributers.indexOf(req.params.user_id)
      if (user == -1)
        res.status(400).json({ notfound: 'User not found' })
      project.contributers.splice(user, 1);
      project.joinrequests.splice(user, 1);
      return project.save()
    })
    .then((project) => {
      Project.findById(req.params.id)
        .then(project => res.json(project))
    })
    .catch(err => {
      console.log(err)
      res.status(400).json(err)
    })
})

// @route  GET api/project/:id
// @desc   Put update project
// @access Private
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Project.findById(req.params.id)
    .then((project) => {
      if (!project)
        res.status(404).json({ noproject: 'Project not found' })
      if (!isFound(project.admins, req.user.id))
        res.status(403).json({ unauthorized: 'User not authorized.' })
      return Project.findByIdAndUpdate(req.params.id, req.body)
    })
    .then((project) => {
      return Project.findById(req.params.id)
    })
    .then((project => res.json(project)))
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
})


// @route  Delete api/project/:id/admins
// @desc   Delete a Project
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  let project;
  Project.findById(req.params.id)
    .then((project) => {
      if (!isFound(project.admins, req.user.id))
        return res.status(403).json({ unauthorized: 'User not admin' })

      Project.findById(req.params.id)
        .then((project) => {
          if (!project)
            return res.status(403).json({ notfound: 'Project not found' })
          project = project;
          return ChatGroup.findByIdAndRemove(project.chatgroup)
        })
        .then(() => {
          return project.remove()
        })
        .then(() => {
          return res.json({ success: true })
        })
        .catch(err => {
          console.log(err)
        })
    })
})


// @route  Get api/poject/:id/uploads
// @desc   Get project uploads
// @access Public
router.post('/:id/uploads', passport.authenticate('jwt', { session: false }), upload.single('file'), (req, res) => {
  // if (req) {
  const uploadData = {
    userid: req.user.id,
    filename: req.file.filename,
    fileuir: mediaURI + req.file.filename
  }

  Project.findById(req.params.id)
    .then((project) => {
      console.log('+++++++++++++++++++++: ', project)
      project.uploads.unshift(uploadData)
      return project.save()
    })
    .then((project) => {
      console.log('after saving the file: ', project)
      res.json(project)
    })
    .catch((err) => {
      console.log('cash wtf')
      res.json(err)
    })
})

// @route  Get api/poject/:id/uploads
// @desc   Get project uploads
// @access Public
router.post('/:id/uploads', passport.authenticate('jwt', { session: false }), upload.single('file'), (req, res) => {
  // if (req) {
  const uploadData = {
    userid: req.user.id,
    filename: req.file.filename,
    fileuir: mediaURI + req.file.filename
  }

  Project.findById(req.params.id)
    .then((project) => {
      console.log('+++++++++++++++++++++: ', project)
      project.uploads.unshift(uploadData)
      return project.save()
    })
    .then((project) => {
      console.log('after saving the file: ', project)
      res.json(project)
    })
    .catch((err) => {
      console.log('cash wtf')
      res.json(err)
    })
})

// @route  Delete api/poject/:id/uploads
// @desc   Delete project uploads
// @access Public
router.delete('/:id/uploads/:upload_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Project.findById(req.params.id)
    .then((project) => {
      const isAdmin = isFound(project.admins, req.user.id)
      const uploadedFile = project.uploads.filter((upload) => upload._id == req.params.upload_id)[0]
      const isUploader = uploadedFile.userid == req.user.id;

      // checking if the user is admin or not
      if (!isAdmin && !isUploader)
        return res.json({ error: 'user not authorized!' })

      console.log(req.params.upload_id)
      const uploadedFileIndex = project.uploads.map(upload => upload.id).indexOf(req.params.upload_id)

      project.uploads.splice(uploadedFileIndex, 1)
      console.log(project.uploads)
      return project.save()
    })
    .then((project) => {
      res.json(project.uploads)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
})


function isFound(collection, user_id) {
  return collection.filter((item) => item._id.toString() == user_id).length == 0 ? false : true
}


module.exports = router