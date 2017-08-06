const express = require('express')
const morgan = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const config = require('config')
const boom = require('boom')

const app = express()

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

app.post(
  '/v1/api/activities',
  bodyParser.json(),
  (req, res) => {
    const { name, alt } = req.body
    // 9/ Dodajemy podstawową walidację kompletności danych.
    if (!name) {
      throw boom.badRequest('`name` is missing')
    }
    if (!alt) {
      throw boom.badRequest('`alt` is missing')
    }
    if (Object.keys(req.body).length > 2) {
      throw boom.badRequest(`Extra fields given: ${Object.keys(req.body)}`)
    }
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
app.get('/v1/api/activities', (req, res) => {
  res.json(activities)
})

app.get('/v1/api/activities/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const activity = activities.find(x => x.id === id)
  // 3/ Upraszczamy obsługę błędow 404
  if (!activity) {
    throw boom.notFound('The activity does not exist.')
  }

  res
    .status(200)
    .json(activity)
})

app.delete('/v1/api/activities/:id', (req, res) => {
  const id = parseInt(req.params.id, 10)
  const idx = activities.findIndex(x => x.id === id)
  if (!idx) {
    throw boom.notFound('The activity does not exist.')
  }

  activities.splice(idx, 1)

  res
    .status(204)
    .end()
})

app.patch(
  '/v1/api/activities/:id',
  bodyParser.json(),
  (req, res) => {
    const id = parseInt(req.params.id, 10)
    const activity = activities.find(x => x.id === id)
    if (!activity) {
      throw boom.notFound('The activity does not exist.')
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

// 16/ Na samym końcu dodajemy error middleware, w którym zamienimy błędy boom na odpowiedzi.
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
      code: err.output.statusCode,
      message: err.message
    })
})

if (config.get('env') !== 'production') {
  app.use(errorhandler())
}

module.exports = app
