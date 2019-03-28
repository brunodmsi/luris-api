const Accessibility = require('../models/Accessibility')

class AccessibilityController {
  async store (req, res) {
    const { latitude, longitude } = req.body
    const userId = req.userId

    if (await Accessibility.findOne({ latitude, longitude })) {
      return res.status(400).json({ error: 'Location already exists' })
    }

    const access = await Accessibility.create({
      latitude: latitude,
      longitude: longitude,
      userCreated: userId
    })

    return res.json(access)
  }

  async locations (req, res) {
    const locations = await Accessibility.find({})

    return res.json(locations)
  }
}

module.exports = new AccessibilityController()
