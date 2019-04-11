const express = require('express')

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

const controllers = require('./app/controllers')

routes.post('/users', controllers.UserController.store)
routes.post('/sessions', controllers.SessionController.store)

routes.get(
  '/access',
  authMiddleware,
  controllers.AccessibilityController.locations
)
routes.post(
  '/access',
  authMiddleware,
  controllers.AccessibilityController.store
)
routes.put(
  '/access/:id',
  authMiddleware,
  controllers.AccessibilityController.update
)
routes.delete(
  '/access/:id',
  authMiddleware,
  controllers.AccessibilityController.delete
)

module.exports = routes
