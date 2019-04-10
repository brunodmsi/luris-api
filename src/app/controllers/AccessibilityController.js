const Accessibility = require('../models/Accessibility')
const googleConfig = require('../../config/google')
const googleapi = require('@google/maps').createClient({
  key: googleConfig.key
})

class AccessibilityController {
  async store (req, res) {
    const { latitude, longitude } = req.body
    const userId = req.userId

    // if (await Accessibility.findOne({ latitude, longitude })) {
    //   return res.status(400).json({ error: 'Location already exists' })
    // }

    googleapi.reverseGeocode({latlng: `${latitude},${longitude}`},
    function(err, res) {
      if(!err) {
        const tmp = res.json.results[0]
        formatted_address = tmp.formatted_address
        latitude = tmp.geometry.location.lat
        longitude = tmp.geometry.location.lng
      } else {
        console.log(err)
      }
    })

    const access = await Accessibility.create({
      latitude: latitude,
      longitude: longitude,
      formatted_address: formatted_address,
      userCreated: userId
    })

     return res.json(access)
  }

  async locations (req, res) {
    const locations = await Accessibility.find({})

    return res.json(locations)
  }

  async update (req, res) {
    const point = req.params.id
    const { latitude, longitude } = req.body

    const location = await Accessibility.findOne({
      _id: point
    })

    if (location.userCreated.toString() !== req.userId) {
      return res.status(400).json({ error: 'User creation doesnt correspond' })
    }

    location.latitude = latitude
    location.longitude = longitude

    location.save()
    return res.json(location)
  }

  async delete (req, res) {
    const point = req.params.id

    const location = await Accessibility.findOne({ _id: point })

    if (location.userCreated.toString() !== req.userId) {
      return res.status(400).json({ error: 'User creation doesnt correspond' })
    }

    location.delete()
    return res.json({ ok: true })
  }
}

module.exports = new AccessibilityController()
