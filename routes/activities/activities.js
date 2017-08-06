const Router = require('express').Router
const bodyParser = require('body-parser')
const boom = require('boom')
const Joi = require('joi')
const celebrate = require('celebrate')

const model = require('../../models/activities')

// 5/ Schema pozostaje niezmieniona
const activitySchema = Joi.object().keys({
  name: Joi.string().alphanum().min(3).max(30).required(),
  alt: Joi.string().token().min(3).max(30).required(),
  timeSpent: Joi.number().greater(0).default(0)
})

class Activities {
  constructor (model) {
    this._model = model

    this.router = Router()
    this.router.route('/')
      // 5/ Walidację wpinamy jako middleware
      .post(
        bodyParser.json(),
        celebrate({ body: activitySchema }),
        (req, res, next) => this.new(req, res).catch(next)
      )
      .get((req, res, next) => this.list(req, res).catch(next))

    this.router.route('/:id')
      .get((req, res, next) => this.get(req, res).catch(next))
      .patch(bodyParser.json(), (req, res, next) => this.update(req, res).catch(next))
      .delete((req, res, next) => this.delete(req, res).catch(next))
  }

  async new (req, res) {
    const { name, alt } = req.body
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

module.exports = new Activities(model).router
