const Joi = require('joi')
const boom = require('boom')

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (req, reply) => {
      reply('Hello World!');
    }
  },
  {
    method: 'GET',
    path: '/notFound',
    config: {
      handler: (req, reply) => {
        reply(boom.notFound('Not found!'))
      },
      response: {
        schema: Joi.object({
          id: Joi.number()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/activities',
    config: {
      validate: {
        payload: {
          name: Joi.string().required(),
          alt: Joi.string().allow('').default(''),
          timeSpent: Joi.number().positive().default(0)
        }
      },
      response: {
        status: {
          200: Joi.object({
            id: Joi.number().max(2)
          })
        }
      },
      handler: (req, reply) => {
        reply({ id: Math.floor(Math.random() * 5)})
      }
    }
  }
]
