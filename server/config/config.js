const config = {
  PORT: process.env.PORT || 8000,
  CONNECTION_URI: process.env.MONGODB_URI || 'mongodb://localhost/axum_hub',
  secretOrKey: 'AxumHUB-MicroProject2020'
}

module.exports = config