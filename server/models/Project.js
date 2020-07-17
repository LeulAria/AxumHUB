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
    type: String
  },
  contributers: [
    {
      contributer: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  version: {
    type: String,
    required: true
  },
  licence: {
    type: String,
    required: true
  },
  developmentModel: {
    type: String
  },
  tools: [String],
  rating: Number,
  website: {
    type: String
  },
  githubrepolink: {
    type: String,
  },
  admins: [
    {
      admin: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  projectgroup: {
    type: Schema.Types.ObjectId,
    ref: 'chatgroup'
  },
  data: {
    type: Date,
    default: date
  }
})

const Project = mongoose.model('project', ProjectSchema)
module.exports = Project