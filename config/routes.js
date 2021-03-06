/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
  '/': 'HomeController.index',
  '/auth/token': 'AuthController.token',
  'GET /auth/authorize': 'AuthController.authorize',
  'POST /auth/decision': 'AuthController.decision',
  // 'POST /login': 'AuthController.authenticate',

  // users
  '/users/login': 'UserController.login',
  '/users/new': 'UserController.new',
  'POST /users/authenticate': 'UserController.authenticate',
  'POST /users/register': 'UserController.register',
  '/users/logout': 'UserController.logout',

  // integrations
  'GET /integrations': 'IntegrationController.list',
  'GET /integrations/new': 'IntegrationController.new',
  'POST /integrations': 'IntegrationController.create',
  'POST /integrations/:id/delete': 'IntegrationController.delete',

  // not for production
  '/test': 'AuthController.test',
  '/clients': 'ClientController.list',

  // learn more
  '/learn-more': 'HomeController.learnMore',

  '/discover': 'DeviceController.discover',
  '/control': 'DeviceController.control'
}
