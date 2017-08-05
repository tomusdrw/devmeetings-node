// Zamiast connect importujemy `express`
const express = require('express')
const morgan = require('morgan')
const serveStatic = require('serve-static')
const errorhandler = require('errorhandler')
const config = require('config')

// API express jest zgodne z connect, więc nie musimy zmieniać nic w aplikacji.
const app = express()

if (config.get('env') !== 'production') {
  app.use(errorhandler())
}

app.use((req, res, next) => {
  const start = process.hrtime()

  res.on('finish', () => {
    const time = process.hrtime(start)
    const ms = time[0] * 1e3 + time[1] * 1e-6
    console.log(`${ms} ms`)
  })

  next()
})

app.use(morgan('dev'))
app.use(serveStatic('static'))

app.use('/api/activities', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify([
    {
      id: 3,
      alt: 'Bicycle',
      name: 'Cycling',
      timeSpent: 120
    },
    {
      id: 7,
      alt: 'Swimmer',
      name: 'Swimming',
      timeSpent: 60
    },
    {
      id: 9,
      alt: 'Runners',
      name: 'Running',
      timeSpent: 30
    }
  ]))
})

app.use('/version', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify({
    version: require('./package.json').version,
    env: config.get('env')
  }))
})

app.use('/crash', () => {
  throw new Error('Crashing!')
})

module.exports = app
