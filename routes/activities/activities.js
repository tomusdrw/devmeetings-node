const Router = require('express').Router
const bodyParser = require('body-parser')
const boom = require('boom')

// Tworzymy klasę aktywności
class Activities {
  // 13/ W konstruktorze dostajemy model i określamy definicje routingu.
  constructor (model) {
    this._model = model

    this.router = Router()
    this.router.route('/')
      .post(bodyParser.json(), (req, res) => this.new(req, res))
      .get((req, res) => this.list(req, res))

    this.router.route('/:id')
      .get((req, res) => this.get(req, res))
      .patch(bodyParser.json(), (req, res) => this.update(req, res))
      .delete((req, res) => this.delete(req, res))
  }

  new (req, res) {
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
    const id = this._model.length + 1
    const timeSpent = 0
    const activity = { id, name, alt, timeSpent }

    this._model.push(activity)

    res
      .status(201)
      .set('Content-Location', `/v1/api/activities/${id}`)
      .json(activity)
  }

  // 3/ Implementację poszczególnych metod wrzucamy w klasę.
  list (req, res) {
    res.json(this._model)
  }

  get (req, res) {
    const id = parseInt(req.params.id, 10)
    const activity = this._model.find(x => x.id === id)
    if (!activity) {
      throw boom.notFound('The activity does not exist.')
    }

    res
      .status(200)
      .json(activity)
  }

  delete (req, res) {
    const id = parseInt(req.params.id, 10)
    const idx = this._model.findIndex(x => x.id === id)
    if (!idx) {
      throw boom.notFound('The activity does not exist.')
    }

    this._model.splice(idx, 1)

    res
      .status(204)
      .end()
  }

  update (req, res) {
    const id = parseInt(req.params.id, 10)
    const activity = this._model.find(x => x.id === id)
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
}

// 20/ Eksportujemy `router` z nowo utworzonej instancji.
module.exports = new Activities([
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
]).router
