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
  // 3/ Middleware do authoryzacji będzie teraz wymagał tokena JWT
  return jwt({
    // Secret używany jest do weryfikacji sygnatury
    secret: config.get('secret')
  })
}

module.exports = { validateRes, requireAuth }
