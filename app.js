const celebrate = require('celebrate')
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
      statusCode: err.output.statusCode,
      message: err.message
    })
})

app.use(celebrate.errors())

if (config.get('env') !== 'production') {
  app.use(errorhandler())
}

module.exports = app
