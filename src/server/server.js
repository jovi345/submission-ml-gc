require('dotenv').config()
const Hapi = require('@hapi/hapi')

const routes = require('./routes')

const ClientError = require('../exceptions/ClientError')
;(async () => {
  const server = Hapi.server({
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: 3000,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  server.route(routes)

  server.ext('onPreResponse', (request, h) => {
    const response = request.response

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      })
      newResponse.code(response.statusCode)
      return newResponse
    }

    if (response.isBoom) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      })
      newResponse.code(response.output.statusCode)
      return newResponse
    }

    return h.continue
  })

  await server.start()
  console.log(`Server start at: ${server.info.uri}`)
})()
