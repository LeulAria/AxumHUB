const Validator = require('validator')
const isEmpty = require('./is_empty')
const passwordPWNED = require('../utils/PWNED')

const validateRegisterInput = async (data) => {
  let errors = {}
  let result = await passwordPWNED(data.password)

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 }))
    errors.name = 'Name must be between 2 and 30'
  if (Validator.isEmpty(data.name))
    errors.name = 'Name field is required'

  if (!Validator.isEmail(data.email))
    errors.email = 'Email is invalid'
  if (Validator.isEmpty(data.email))
    errors.email = 'Email field is required'

  if (!Validator.isLength(data.password, { min: 8, max: 16 }))
    errors.password = 'Password must be at least 8 characters'
  if (Validator.isEmpty(data.password))
    errors.password = 'Password field is required'

  if (result > 0){
    errors.password = `Oh no — pwned! This password has been seen ${result} times before`
  }

  if (Validator.isEmpty(data.password2))
    errors.password2 = 'Confirm Password field is required'

  if (!Validator.equals(data.password, data.password2))
    errors.password2 = 'Passwords must match!'

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateRegisterInput