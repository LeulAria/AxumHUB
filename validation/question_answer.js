const Validator = require('validator')
const isEmpty = require("./is_empty")

module.exports = function validateQuestionAnswerInput(data) {
  const errors = {};

  data.answer = !isEmpty(data.answer) ? data.answer : '';

  if (Validator.isEmpty(data.answer))
    errors.answer = 'Answer field is required'

  return {
    errors,
    isValid: isEmpty(errors)
  }
}