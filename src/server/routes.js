const { predictHandler, getHistories } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/predict',
    handler: predictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1000000,
      },
    },
  },
  {
    method: 'GET',
    path: '/predict/histories',
    handler: getHistories,
  },
]

module.exports = routes
