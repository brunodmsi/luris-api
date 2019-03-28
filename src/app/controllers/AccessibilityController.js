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

  async update (req, res) {
    const { oldLat, oldLong, newLat, newLong } = req.body

    const location = await Accessibility.findOne({
      latitude: oldLat,
      longitude: oldLong
    })

    if (location.userCreated.toString() !== req.userId) {
      return res.status(400).json({ error: 'User creation doesnt correspond' })
    }

    location.latitude = newLat
    location.longitude = newLong

    location.save()
    return res.json(location)
  }

  async delete (req, res) {
    const { latitude, longitude } = req.body

    const location = await Accessibility.findOne({ latitude, longitude })
    console.log(location)
    if (location.userCreated.toString() !== req.userId) {
      return res.status(400).json({ error: 'User creation doesnt correspond' })
    }

    location.delete()
    return res.json({ ok: true })
  }
}

module.exports = new AccessibilityController()
