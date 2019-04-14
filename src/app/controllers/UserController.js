const User = require('../models/User')

function validateEmail (email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

class UserController {
  async store (req, res) {
    const { email } = req.body

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Usuario ja existe' })
    }

    const isValid = validateEmail(email)
    if (!isValid) {
      return res.status(400).json({ error: 'O email digitado não é válido' })
    }
    const user = await User.create(req.body)

    return res.json(user)
  }
}

module.exports = new UserController()
