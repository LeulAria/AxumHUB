const Validator = require('validator')
const isEmpty = require('./is_empty')

module.exports = validateExperianceInput = (data) => {
  const errors = {}

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (!Validator.isLength(data.title, { min: 5, max: 40 }))
    errors.title = 'Title must be between 10 & 40 characters'

  if (Validator.isEmpty(data.title))
    errors.title = 'Title field is requried'
  if (Validator.isEmpty(data.company))
    errors.company = 'Company field is requried'
  if (Validator.isEmpty(data.from))
    errors.from = 'From field is requried'

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
