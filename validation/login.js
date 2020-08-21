const Validator = require('validator')
const isEmpty = require('./is_empty')

module.exports = function validateLoginForm(data) {
  const errors = {}

  data.email = !isEmpty(data.email) ? data.email : '';
  data.name = !isEmpty(data.name) ? data.name : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.email) && Validator.isEmpty(data.name))
    errors.handle = 'Email/Username Field is required'

  if (Validator.isEmpty(data.name) && !Validator.isEmail(data.email))
    errors.handle = 'Email is invalid'

  if (!Validator.isLength(data.password, { min: 8, max: 16 }))
    errors.password = 'Password must be at least 8 characters'
  if (Validator.isEmpty(data.password))
    errors.password = 'Password field is required'

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
