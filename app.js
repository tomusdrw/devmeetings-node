const boom = require('boom')
const celebrate = require('celebrate')
const config = require('config')
const errorhandler = require('errorhandler')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

const routes = require('./routes')

const app = express()

app.use(morgan('dev'))

// Wstawiamy helmet zaraz na samym początku i konfigurujemy opcje
app.use(helmet({
  // 5/ Ładuj zasoby tylko i wyłącznie z własnej domeny i xpla.org
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\'', 'https://xpla.org/']
    }
  },
  // 4/ Chroń prywatność użytkowników i nie pozwalają na wczesne
  // -- Rozwiązywanie DNS
  dnsPrefetchControl: {
    allow: false
  },
  // 3/ Chroń przed click-jackingiem (dla starych przeglądarek, dla reszty CSP)
  frameguard: {
    action: 'deny'
  },
  // Nie ujawniaj, że strona działa na node+express
  hidePoweredBy: {},
  // Strict-Transport jeżeli strona jest serwerowana przez https
  hsts: {},
  // Nie pozwalaj na otwieranie załączników w kontekście Twojej strony na starym IE
  ieNoOpen: {},
  // Wymagaj poprawnego Content-Type (np. nie ładuj obrazka z CT text/html)
  noSniff: {},
  // 3/ Nie wysyłaj nagłówka Referer do zewnętrznych serwisów
  referrerPolicy: {
    policy: 'origin-when-cross-origin'
  },
  // Chroń przed specyficznym typem ataku XSS
  xssFilter: {}
}))

app.use(express.static('static'))

app.use(routes)

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
