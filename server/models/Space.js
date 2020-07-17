const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Space = new Schema({
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  name: {
    type: String,
    requried: true
  },
  description: {
    type: String,
    required: true
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  spacelink: {
    type: String,
    required: true
  },
  tags: [String],
  posts: [
    {
      post: {
        type: Schema.Types.ObjectId,
        ref: 'post'
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})