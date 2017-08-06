const Router = require('express').Router
const bodyParser = require('body-parser')
const boom = require('boom')

const model = require('../../models/activities')

class Activities {
  constructor (model) {
    this._model = model

    // 4/ Musimy złapać wyjątki z asynchronicznych metod
    this.router = Router()
    this.router.route('/')
      .post(bodyParser.json(), (req, res, next) => this.new(req, res).catch(next))
      .get((req, res, next) => this.list(req, res).catch(next))

    this.router.route('/:id')
      .get((req, res, next) => this.get(req, res).catch(next))
      .patch(bodyParser.json(), (req, res, next) => this.update(req, res).catch(next))
      .delete((req, res, next) => this.delete(req, res).catch(next))
  }

  async new (req, res) {
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

    const activity = await this._model.newActivity(name, alt)

    res
      .status(201)
      .set('Content-Location', `${req.originalUrl}/${activity.id}`)
      .json(activity)
  }

  async list (req, res) {
    res.json(await this._model.activities())
  }

  async get (req, res) {
    const id = parseInt(req.params.id, 10)
    const activity = await this._model.getActivity(id)

    if (!activity) {
      throw boom.notFound('The activity does not exist.')
    }

    res
      .status(200)
      .json(activity)
  }

  async delete (req, res) {
    const id = parseInt(req.params.id, 10)
    const removed = await this._model.removeActivity(id)

    if (!removed) {
      throw boom.notFound('The activity does not exist.')
    }

    res
      .status(204)
      .end()
  }

  async update (req, res) {
    const id = parseInt(req.params.id, 10)
    const activity = await this._model.updateActivity(id, req.body)

    if (!activity) {
      throw boom.notFound('The activity does not exist.')
    }

    res
      .status(200)
      .set('Content-Location', `/v1/api/activities/${id}`)
      .json(activity)
  }
}

// 20/ Eksportujemy `router` z nowo utworzonej instancji.
module.exports = new Activities(model).router
