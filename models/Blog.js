const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String
  },
  body: {
    type: String
  },
  blogimage: {
    type: String
  },
  postType: {
    type: String
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  jobtitle: {
    type: String
  },
  company: {
    type: String
  },
  jobtype: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  adress: {
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Blog = mongoose.model('blog', BlogSchema);
module.exports = Blog