const config = require('config')
const errorhandler = require('errorhandler')
const express = require('express')
const morgan = require('morgan')

const routes = require('./routes')

const app = express()

app.use(morgan('dev'))
app.use(express.static('static'))

app.use(routes)

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next()
  }

  if (!err.isBoom) {
    return next(err)
  }

  res
    .status(err.output.statusCode)
    .json({
      error: {
        code: err.output.statusCode,
        message: err.message
      }
    })
})

if (config.get('env') !== 'production') {
  app.use(errorhandler())
}

module.exports = app
