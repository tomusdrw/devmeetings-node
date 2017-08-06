const Joi = require('joi')

// 26/ Middleware, który będzie walidował odpowiedź.
function validateRes (schema) {
  return (req, res, next) => {
    // Zapisujemy originalną metodę json
    const origJson = res.json

    // Nadpisujemy metodę `json` na obiekcie res
    res.json = function (data) {
      const ret = origJson.call(this, data)
      // 3/ Pomiń błędy
      if (data.statusCode) {
        return ret
      }
      const result = Joi.validate(data, schema)

      if (result.error) {
        // Raportowanie błędów
        console.error(`Invalid response generated for ${req.orginalUrl}`, result.error, result.value)
      }

      return ret
    }

    // A następnie odpalamy kolejny middleware
    next()
  }
}

module.exports = { validateRes }
