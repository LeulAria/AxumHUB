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
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    {
      type: String,
      required: true
    },
    {
      type: Date,
      default: Date.now
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

const ChatGroup = mongoose.model('chatgroup', ChatGroupSchema)
module.exports = ChatGroup