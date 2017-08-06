const Joi = require('joi')
const boom = require('boom')

function validateRes (schema) {
  return (req, res, next) => {
    const origJson = res.json

    res.json = function (data) {
      const ret = origJson.call(this, data)
      if (data.statusCode) {
        return ret
      }
      const result = Joi.validate(data, schema)

      if (result.error) {
        console.error(`Invalid response generated for ${req.orginalUrl}`, result.error, result.value)
      }

      return ret
    }

    next()
  }
}

function requireAuth () {
  return (req, res, next) => {
    if (req.header('X-Secret') === 'secretcode') {
      return next()
    }

    throw boom.unauthorized('You are not authorized to access this endpoint.')
  }
}

module.exports = { validateRes, requireAuth }
