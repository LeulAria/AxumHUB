const express = require('express');
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors')({ origin: true });
const app = express();

// Production Environment
process.env.NODE_ENV = "production"
// process.env.NODE_ENV = "development"

const config = require('./config/config')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors);

mongoose.connect(config.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Successfully Connected to MongoDB'))
  .catch((err) => console.log(err))
mongoose.Promise = global.Promise
mongoose.set('debug', true)

// Passport Middle waere
app.use(passport.initialize())

//Passport config jwtstrategy
require('./config/passport')(passport)

// test
app.get('/', (req, res) => {
  res.send('<h1 style="font-family: monospace; text-align: center; margin-top: 5em;">axum-hub api</h1>')
})

// apis
app.use('/api/users', require('./router/api/users'))
app.use('/api/profile', require('./router/api/profile'))
app.use('/api/question_post', require('./router/api/question_post'))
app.use('/api/project', require('./router/api/project'))

const server = app.listen(config.PORT, () => console.log(`Server started on http://localhost:${config.PORT}`))

module.exports = server

require('./router/api/socket/chat');