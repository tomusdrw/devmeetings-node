const boom = require('boom')
const celebrate = require('celebrate')
const config = require('config')
const corser = require('corser')
const errorhandler = require('errorhandler')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const proxy = require('express-http-proxy')

const routes = require('./routes')
const protected = require('./protected')

const app = express()

app.set('view engine', 'pug')

app.use(morgan('dev'))

app.use(corser.create({
  origins: ['http://devmeetings.pl']
}))

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\'', 'https://xpla.org/']
    }
  },
  dnsPrefetchControl: {
    allow: false
  },
  frameguard: {
    action: 'deny'
  },
  hidePoweredBy: {},
  hsts: {},
  ieNoOpen: {},
  noSniff: {},
  referrerPolicy: {
    policy: 'origin-when-cross-origin'
  },
  xssFilter: {}
}))

app.use(express.static('static'))

app.use(routes)
app.use('/protected', protected)
// Wszystkie requesty, które nie zostały obsłużone wcześniej wysyłamy do proxy.
app.use(proxy('xpla.org'))

app.use((err, req, res, next) => {
  if (err.code === 'permission_denied') {
    next(boom.forbidden(err.message))
  } else if (err.name === 'UnauthorizedError') {
    next(boom.unauthorized(err.message))
  } else {
    next(err)
  }
})

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
