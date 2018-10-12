const locationController = require('../controllers/location');

module.exports = (app) => {
  app.route('/locations')
    .post(locationController.create)

  app.route('/locations/:locationId')
    .get(locationController.getOneLocation)
  
  app.get('/', (req, res) => res.status(200).send({
    message: "Welcome to Mai PMS.",
  }));

  app.get('/*', (req, res) => res.status(404).send({
    message: "Page not found",
  }));
}