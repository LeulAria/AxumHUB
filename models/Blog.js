const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  blogimage: {
    type: String,
    required: true
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
})

const Blog = mongoose.model('blog', BlogSchema);
module.exports = Blog