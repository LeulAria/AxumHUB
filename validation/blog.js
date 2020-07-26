const Validator = require('validator')
const isEmpty = require('./is_empty')

module.exports = validateBlogInput = (data) => {
  const errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.body = !isEmpty(data.body) ? data.body : '';
  data.slug = !isEmpty(data.slug) ? data.slug : '';

  if (Validator.isEmpty(data.title))
    errors.title = "Title field is required"
  if (Validator.isEmpty(data.body))
    errors.body = "Body field is required"
  if (Validator.isEmpty(data.slug))
    errors.slug = "Slug field is required"

  if (!Validator.isLength(data.title, { min: 5, max: 50 })) {
    errors.title = "Title fied should be 5 - 50 characters long"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}