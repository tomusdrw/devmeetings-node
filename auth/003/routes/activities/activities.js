const Router = require('express').Router
const bodyParser = require('body-parser')
const boom = require('boom')
const celebrate = require('celebrate')

const model = require('../../models/activities')
const { validateRes, requireAuth } = require('../utils')
const schemas = require('../../schemas')

class Activities {
  constructor (model) {
    this._model = model

    this.router = Router()
    this.router.route('/')
      .post(
        requireAuth(),
        bodyParser.json(),
        celebrate({ body: schemas.activity }),
        (req, res, next) => this.new(req, res).catch(next)
      )
      .get(
        celebrate({ query: schemas.listing }),
        (req, res, next) => this.list(req, res).catch(next)
      )

    this.router.route('/:id')
      .get(validateRes(schemas.activity), (req, res, next) => this.get(req, res).catch(next))
      .patch(
        requireAuth(),
        bodyParser.json(),
        (req, res, next) => this.update(req, res).catch(next)
      )
      .delete(
        requireAuth(),
        (req, res, next) => this.delete(req, res).catch(next)
      )
  }

  async new (req, res) {
    console.log(req.user)
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
