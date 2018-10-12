const Location = require('../models').Location;


module.exports = {
  create(req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({
        message: 'Request cannot be empty'
      });
    };
    const { name, parentLocation, zip, male, female } = req.body;

    const createLocation = (parentLoc = null) => Location.create({
      name,
      parentLocation: parentLoc,
      zip,
      male,
      female
    })
    .then(location => {
      if (location) {
        return res.status(201).send({
          location,
          message: 'Location saved successfully'
        });
      }
    })
    .catch(e => res.status(400).send({ message: e.errors[0].message || e }));

    if (parentLocation) {
      Location.findOne({ where: { id: parentLocation } })
      .then((loc) => {
        if (!loc) {
          return res.status(400).send({ message: 'Parent location not found' });
        } else {
          createLocation(loc.id);
        }
      }) 
      .catch(e => res.status(400).send({ message: e.errors[0].message || e }));
    } else {
      createLocation();
    }
  },

  getOneLocation(req, res) {
    const { locationId } = req.params;

    if (isNaN(locationId)) return res.status(400).send({ message: 'Invalid location id' })

    return Location.findById(locationId)
    .then(location => {
      if (!location) return res.status(404).send({ message: 'Location not found' })

      return res.status(200).send({ location });
    })
    .catch(e => res.status(400).send({ message: e.errors[0].message || e }));
  },
}
