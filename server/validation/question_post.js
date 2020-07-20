const Validator = require('validator')
const isEmpty = require("./is_empty")

module.exports = function validateQuestionPostInput(data) {
  const errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.description = !isEmpty(data.description) ? data.description : '';

  if (Validator.isEmpty(data.title))
    errors.title = 'Title field is required'
  if (Validator.isEmpty(data.description))
    errors.description = 'Description field is required'

  if (Validator.isLength(data.title, { min: 3, max: 30 }))
    errors.title = "Title field should between 5- 40 "

  return {
    errors,
    isValid: isEmpty(errors)
  }
}