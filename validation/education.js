const Validator = require('validator')
const isEmpty = require('./is_empty')

module.exports = validateExperianceInput = (data) => {
  const errors = {}

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.school))
    errors.school = 'School field is required'
  if (Validator.isEmpty(data.degree))
    errors.degree = 'Degree field is required'
  if (Validator.isEmpty(data.from))
    errors.from = 'From field is required'

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
