if (process.env.NODE_ENV === 'production') {
  module.exports = require('./config_prod')
} else {
  module.exports = require('./config_dev')
}