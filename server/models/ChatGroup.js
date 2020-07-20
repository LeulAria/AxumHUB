const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ChatGroupSchema = new Schema({
  admins: [
    {
      admin: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  name: {
    type: String,
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'project'
  },
  members: [
    {
      member: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  chats: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      message: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  joinrequests: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ]
})

const ChatGroup = mongoose.model('chatgroup', ChatGroupSchema)
module.exports = ChatGroup