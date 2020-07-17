const mongoose = require("mongoose")
const Schema = mongoose.Schema

const QuestionPostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    require: true
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
  answers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      answer: {
        type: String,
        required: true
      },
      name: {
        type: String,
      },
      upvoates: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
          }
        }
      ],
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  tag: [String],
  date: {
    type: Date,
    default: Date.now
  }
})

const QuestionPost = mongoose.model('questionpost', QuestionPostSchema)
module.exports = QuestionPost;