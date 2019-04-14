const Accessibility = require('../models/Accessibility')
const googleConfig = require('../../config/google')
const googleapi = require('@google/maps').createClient({
  key: googleConfig.key,
  Promise: Promise
})

class AccessibilityController {
  async store (req, res) {
    const { latitude, longitude, type } = req.body
    const userId = req.userId
    var data = {
      address: null,
      neighborhood: null,
      city: null,
      state: null,
      country: null
    }

    if (await Accessibility.findOne({ latitude, longitude })) {
      return res.status(400).json({ error: 'Location already exists' })
    }

    await googleapi
      .reverseGeocode({ latlng: `${latitude},${longitude}` })
      .asPromise()
      .then(res => {
        const tmp = res.json.results[0]
        var [address, rest] = tmp.formatted_address.split('-')
        console.log(rest)
        data.address = address
        data.neighborhood = tmp.address_components[2].long_name
        data.city = tmp.address_components[3].long_name
        data.state = tmp.address_components[4].long_name
        data.country = tmp.address_components[5].long_name
      })
      .catch(err => {
        console.log(err)
      })

    const access = await Accessibility.create({
      latitude: latitude,
      longitude: longitude,
      formatted_address: data.address,
      type: type,
      city: data.city,
      state: data.state,
      country: data.country,
      neighborhood: data.neighborhood,
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
