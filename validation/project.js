const Validator = require('validator')
const isEmpty = require("./is_empty")

module.exports = function validateProjectInput(data) {
  const errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.summary = !isEmpty(data.summary) ? data.summary : '';
  data.version = !isEmpty(data.version) ? data.version : '';
  data.licence = !isEmpty(data.licence) ? data.licence : '';

  if (Validator.isEmpty(data.title))
    errors.title = 'Title field is required'
  if (Validator.isEmpty(data.summary))
    errors.summary = 'Summary field is required'
  if (Validator.isEmpty(data.version))
    errors.version = 'Version field is required'
  if (Validator.isEmpty(data.licence))
    errors.licence = 'Licence field is required'

  if (!Validator.isLength(data.title, { max: 30 }))
    errors.title = "Title field shoudnt exceed 40characters"

  return {
    errors,
    isValid: isEmpty(errors)
  }
}