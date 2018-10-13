const locationController = require('../controllers/location');

module.exports = (app) => {
  app.route('/locations')
    .post(locationController.create)
    .get(locationController.getParentLocations)

  app.route('/locations/:parentLocation')
    .get(locationController.getSubLocationsForParent)

  app.route('/location/:locationId')
    .get(locationController.getOneLocation)
    .delete(locationController.deleteLocation)

  
  app.get('/', (req, res) => res.status(200).send({
    message: "Welcome to Mai PMS.",
  }));

  app.get('/*', (req, res) => res.status(404).send({
    message: "Page not found",
  }));
  app.post('/*', (req, res) => res.status(404).send({
    message: "You cannot post to this page",
  }));
  app.put('/*', (req, res) => res.status(404).send({
    message: "You cannot post to this page",
  }));
  app.delete('/*', (req, res) => res.status(404).send({
    message: "Page not found",
  }));
}