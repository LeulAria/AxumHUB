const express = require('express');
const mongoose = require('mongoose')
const app = express();

const config = require('./config/config')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mongoose.connect(config.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Successfully Connected to MongoDB'))
  .catch((err) => console.log(err))
mongoose.Promise = global.Promise
mongoose.set('debug', true)

// apis
app.use('/api/users', require('./router/api/users'))

app.listen(config.PORT, () => console.log(`Server started on http://localhost:${config.PORT}`))