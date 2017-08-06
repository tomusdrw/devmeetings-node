const express = require('express')
const morgan = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const config = require('config')

const app = express()

if (config.get('env') !== 'production') {
  app.use(errorhandler())
}

app.use(morgan('dev'))
app.use(express.static('static'))

app.get('/version', (req, res) => {
  res.json({
    version: require('./package.json').version,
    env: config.get('env')
  })
})

app.post('/crash', () => {
  throw new Error('Crashing!')
})

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

// 17/ Tworzenie nowej aktywności
app.post(
  '/v1/api/activities',
  bodyParser.json(),
  (req, res) => {
    const { name, alt } = req.body
    const id = activities.length + 1
    const timeSpent = 0
    const activity = { id, name, alt, timeSpent }

    activities.push(activity)

    res
      .status(201)
      .set('Content-Location', `/v1/api/activities/${id}`)
      .json(activity)
  }
)
// 3/ Lista aktywności
app.get('/v1/api/activities', (req, res) => {
  res.json(activities)
})

// 16/ Pobieranie pojedynczej aktywności
app.get('/v1/api/activities/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const activity = activities.find(x => x.id === id)
  if (!activity) {
    res
      .status(404)
      .json({
        message: 'The activity does not exist.'
      })
    return
  }

  res
    .status(200)
    .json(activity)
})

// 17/ Usunięcie aktywności
app.delete('/v1/api/activities/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const idx = activities.findIndex(x => x.id === id)
  if (!idx) {
    res
      .status(404)
      .json({
        message: 'The activity does not exist.'
      })
    return
  }

  activities.splice(idx, 1)

  res
    .status(204)
    .end()
})

// 25/ Edycja aktywności (częściowa)
app.patch(
  '/v1/api/activities/:id',
  bodyParser.json(),
  (req, res) => {
    const id = parseInt(req.params.id, 10)
    const activity = activities.find(x => x.id === id)
    if (!activity) {
      res
        .status(404)
        .json({
          message: 'The activity does not exist.'
        })
      return
    }

    const { name, alt, timeSpent } = req.body
    activity.name = name || activity.name
    activity.alt = alt || activity.alt
    activity.timeSpent = timeSpent || activity.timeSpent

    res
      .status(200)
      .set('Content-Location', `/v1/api/activities/${id}`)
      .json(activity)
  }
)

app.post(
  '/addActivity',
  bodyParser.urlencoded({ extended: false }),
  (req, res) => {
    const { id, name } = req.body

    activities.push({
      id,
      name,
      alt: name,
      timeSpent: 0
    })

    res.redirect(303, '/')
  }
)

module.exports = app
