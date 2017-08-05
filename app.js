const express = require('express')
const morgan = require('morgan')
const errorhandler = require('errorhandler')
// body-parser pozwoli nam odczytać dane z formularza
const bodyParser = require('body-parser')
const config = require('config')

const app = express()

if (config.get('env') !== 'production') {
  app.use(errorhandler())
}

app.use(morgan('dev'))
app.use(express.static('static'))

const activities = [
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
]

app.get('/api/activities', (req, res) => {
  res.json(activities)
})

app.get('/version', (req, res) => {
  res.json({
    version: require('./package.json').version,
    env: config.get('env')
  })
})

app.post('/crash', () => {
  throw new Error('Crashing!')
})

// 13/ Możemy wpinać middlewary także przed obsługą konkretnego endpointa.
app.post(
  '/addActivity',
  bodyParser.urlencoded({ extended: false }),
  (req, res) => {
    const { id, name } = req.body

    activities.push({
      id, name,
      alt: name,
      timeSpent: 0
    })

    // Na koniec przekierowujemy przeglądarkę do głównego URLa
    res.redirect(303, '/')
  }
)

module.exports = app
