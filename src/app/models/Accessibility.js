const mongoose = require('mongoose')

const accessibilitySchema = new mongoose.Schema({
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  },
  userCreated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Accessibility', accessibilitySchema)
