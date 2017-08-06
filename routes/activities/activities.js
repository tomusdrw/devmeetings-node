const Router = require('express').Router
const bodyParser = require('body-parser')
const boom = require('boom')

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

// 5/ Aktywności też są zdefiniowane przez Router. Jego API jest zgodne z express.
const router = Router()
module.exports = router

router.route('/')
  .post(
    bodyParser.json(),
    (req, res) => {
      const { name, alt } = req.body
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
  .get((req, res) => {
    res.json(activities)
  })

router.route('/:id')
  .get((req, res) => {
    const id = parseInt(req.params.id, 10)
    const activity = activities.find(x => x.id === id)
    if (!activity) {
      throw boom.notFound('The activity does not exist.')
    }

    res
      .status(200)
      .json(activity)
  })
  .delete((req, res) => {
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
  .patch(
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
