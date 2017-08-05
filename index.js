//#!/usr/bin/env node

const http = require('http')
const fs = require('fs')
const connect = require('connect')
const morgan = require('morgan')
// Importujemy paczkę...
const serveStatic = require('serve-static')

const port = process.env.PORT || 3000

const app = connect()

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
// ...i rejestrujemy middleware
app.use(serveStatic('static'))

// Jedyną routą w naszym serwerze zostaje lista aktywności.
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

http.createServer(app).listen(port, () => {
  console.log(`Listening on :${port}`)
})
