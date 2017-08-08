const Joi = require('joi')

const activity = Joi.object().keys({
  name: Joi.string().alphanum().trim().min(3).max(30).required(),
  alt: Joi.string().token().trim().min(3).max(30).required(),
  timeSpent: Joi.number().greater(0).default(0)
})

const listing = Joi.object().keys({
  offset: Joi.number().positive().default(0),
  limit: Joi.number().positive().default(10),
  fields: Joi.array().items(Joi.string().valid(activity._inner.children.map(c => c.key))).default(false)
})

module.exports = {
  activity,
  listing
}
