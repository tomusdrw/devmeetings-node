const Joi = require('joi')
const jwt = require('express-jwt')
const config = require('config')

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
  return jwt({
    secret: config.get('secret')
  })
}

module.exports = { validateRes, requireAuth }
