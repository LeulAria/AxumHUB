const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  licence: {
    type: String,
    default: '1.0.0'
  },
  developmentmodel: {
    type: String
  },
  tools: [String],
  stars: {
    type: Number,
    default: 0
  },
  website: {
    type: String
  },
  githubrepolink: {
    type: String,
  },
  createchatgroup: {
    type: Boolean,
    deafult: true
  },
  chatgroupname: {
    type: String
  },
  chatgroup: {
    type: Schema.Types.ObjectId,
    ref: 'chatgroup'
  },
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  contributers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  joinrequests: [
    {
      userid: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      projectid: {
        type: Schema.Types.ObjectId,
        ref: 'project'
      }
    }
  ],
  data: {
    type: Date,
    default: Date.now
  }
})

const Project = mongoose.model('project', ProjectSchema)
module.exports = Project