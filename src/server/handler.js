const ClientError = require('../exceptions/ClientError')
const { predict } = require('../services/inference')
const { loadModel } = require('../services/loadModel')
const { v4: uuid } = require('uuid')
const storeData = require('../services/storeData')
const { Firestore } = require('@google-cloud/firestore')

const predictHandler = async (request, h) => {
  try {
    const model = await loadModel()
    console.log('model loaded!')

    const { image } = request.payload
    const predictions = await predict(model, image)

    const id = uuid()
    const createdAt = new Date().toISOString()
    const treshold = 0.5
    let data = {}

    if (predictions[0] >= treshold) {
      data = {
        id,
        result: 'Cancer',
        suggestion: 'Segera periksa ke dokter!',
        createdAt,
      }
    }

    if (predictions[0] < treshold) {
      data = {
        id,
        result: 'Non-cancer',
        suggestion: 'Penyakit kanker tidak terdeteksi.',
        createdAt,
      }
    }

    await storeData(id, data)

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    })
    response.code(201)
    return response
  } catch (error) {
    throw new ClientError('Terjadi kesalahan dalam melakukan prediksi')
  }
}

const getHistories = async (request, h) => {
  const db = new Firestore()

  const predictCollection = db.collection('predictions')
  const snapshot = await predictCollection.get()

  const data = []
  snapshot.forEach((doc) => {
    data.push({
      id: doc.id,
      ...doc.data(),
    })
  })
  const returnData = data.slice(0, data.length - 1)

  const response = h.response({
    status: 'success',
    data: returnData,
  })
  response.code(200)
  return response
}

module.exports = { predictHandler, getHistories }
