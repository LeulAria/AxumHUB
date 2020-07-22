const mongoose = require('mongoose')
const Schama = mongoose.Schema

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      title: {
        type: String,
        required
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

const Post = mongoose.model('post', PostSchema)
module.exports = Post