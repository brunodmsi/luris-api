const User = require('../models/User')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')

class SessionController {
  async store (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: 'Invalid password' })
    }

    return res.json({ user, token: User.generateToken(user) })
  }

  async checkToken (req, res) {
    const token = req.params.token

    const decoded = jwt.verify(token, authConfig.secret)

    if (decoded.exp < Date.now() / 1000) return res.json({ exp: 1 })
    else return res.json({ exp: 0 })
  }
}

module.exports = new SessionController()
