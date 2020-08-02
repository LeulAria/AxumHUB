const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ChatGroupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'project'
  },
  chats: [
    {
      user: {
        type: String,
        required: true
      },
      id: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      date: {
        type: String,
        required: true
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

const ChatGroup = mongoose.model('chatgroup', ChatGroupSchema)
module.exports = ChatGroup