const config = {
  PORT: process.env.PORT || 8000,
  CONNECTION_URI: process.env.MONGODB_URI,
  secretOrKey: process.env.SECRET_OR_KEY
}

module.exports = config