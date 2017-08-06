const Router = require('express').Router
const bodyParser = require('body-parser')
const boom = require('boom')
const Joi = require('joi')
const celebrate = require('celebrate')

const model = require('../../models/activities')
const { validateRes } = require('../utils')

const activitySchema = Joi.object().keys({
  name: Joi.string().alphanum().trim().min(3).max(30).required(),
  alt: Joi.string().token().trim().min(3).max(30).required(),
  timeSpent: Joi.number().greater(0).default(0)
})

// 5/ Definiujemy schemę dla parametrów
const listingSchema = Joi.object().keys({
  offset: Joi.number().positive().default(0),
  limit: Joi.number().positive().default(10),
  fields: Joi.array().items(Joi.string().valid(activitySchema._inner.children.map(c => c.key))).default(false)
})

class Activities {
  constructor (model) {
    this._model = model

    this.router = Router()
    this.router.route('/')
      .post(
        bodyParser.json(),
        celebrate({ body: activitySchema }),
        (req, res, next) => this.new(req, res).catch(next)
      )
      .get(
        // Dodajemy walidację przekazanego query
        celebrate({ query: listingSchema }),
        (req, res, next) => this.list(req, res).catch(next)
      )

    this.router.route('/:id')
      .get(validateRes(activitySchema), (req, res, next) => this.get(req, res).catch(next))
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
    const { limit, offset, fields } = req.query
    const [len, activities] = await Promise.all([
      this._model.length(),
      this._model.activities(limit, offset, fields)
    ])
    const hasNext = offset + limit < len
    const hasPrev = offset > 0

    const nextLimit = hasNext ? Math.min(limit, len - offset - limit) : limit
    const nextOffset = offset + limit

    const prevLimit = hasPrev ? Math.min(limit, offset) : 0
    const prevOffset = Math.max(offset - limit, 0)

    const link = (limit, offset) => {
      return `${req.protocol}://${req.header('Host')}${req.baseUrl}?limit=${nextLimit}&offset=${nextOffset}`
    }
    res
      .links({
        next: hasNext ? link(nextLimit, nextOffset) : null,
        prev: hasPrev ? link(prevLimit, prevOffset) : null
      })
      .json(activities)
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
