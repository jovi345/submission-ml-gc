const tfjs = require('@tensorflow/tfjs-node')

function predict(model, imageBuffer) {
  const tensor = tfjs.node
    .decodeJpeg(imageBuffer)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat()

  return model.predict(tensor).data()
}

module.exports = { predict }
