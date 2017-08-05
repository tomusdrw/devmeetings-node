const express = require('express')
const morgan = require('morgan')
const errorhandler = require('errorhandler')
const config = require('config')

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
// Zastępujemy serve-static przez express.static
app.use(express.static('static'))

// 22/ Zamieniamy endpoint na get i używamy uproszczonego zwracania responsów.
app.get('/api/activities', (req, res) => {
  res.json([
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
  ])
})

app.get('/version', (req, res) => {
  res.json({
    version: require('./package.json').version,
    env: config.get('env')
  })
})

// 3/ Ustawiamy crash tylko na request POST
app.post('/crash', () => {
  throw new Error('Crashing!')
})

module.exports = app
