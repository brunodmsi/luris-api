const Accessibility = require('../models/Accessibility')
const googleConfig = require('../../config/google')
const googleapi = require('@google/maps').createClient({
  key: googleConfig.key,
  Promise: Promise
})

class AccessibilityController {
  async store (req, res) {
    var data = {
      address: null,
      lat: null,
      lng: null
    }

    const { latitude, longitude } = req.body
    const userId = req.userId

    if (await Accessibility.findOne({ latitude, longitude })) {
      return res.status(400).json({ error: 'Location already exists' })
    }

    await googleapi
      .reverseGeocode({ latlng: `${latitude},${longitude}` })
      .asPromise()
      .then(res => {
        const tmp = res.json.results[0]
        data.address = tmp.formatted_address
        data.lat = tmp.geometry.location.lat
        data.lng = tmp.geometry.location.lng
      })
      .catch(err => {
        console.log(err)
      })

    const access = await Accessibility.create({
      latitude: data.lat,
      longitude: data.lng,
      formatted_address: data.address,
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
