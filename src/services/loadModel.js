const tfjs = require('@tensorflow/tfjs-node')

function loadModel() {
  const modelUrl = process.env.MODEL_URL
  return tfjs.loadGraphModel(modelUrl)
}

module.exports = { loadModel }
