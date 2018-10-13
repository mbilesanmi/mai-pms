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

  getParentLocations(req, res) {
    return Location.findAndCountAll({
      where: {
        parentLocation: null
      },
      order: [['updatedAt', 'DESC']]
    })
    .then(locations => {
      if (locations.count > 0) {
        for (let i = 0; i < locations.count; i++) {
          const { male, female } = locations.rows[i].dataValues;
          const totalPopulation = male + female;

          locations.rows[i].dataValues['totalPopulation'] = totalPopulation;
        }
        return res.status(200).send({ locations });
      } else {
        return res.status(200).send({ message: 'No locations found' });
      }
    })
    .catch(e => res.status(400).send({ message: e.errors[0].message || e }));
  },

  getSubLocationsForParent(req, res) {
    const { parentLocation } = req.params;
    if (isNaN(parentLocation)) return res.status(400).send({ message: 'Invalid parent location id' })

    return Location.findAll({
      where: {
        $or: {
          id: parentLocation,
          parentLocation: parentLocation
        }
      },
      order: [[ 'id', 'ASC' ]]
    })
    .then(locations => {
      if (locations.length > 0) {
        let mainLocation = {}
        let subLocations = []
        for (let i = 0; i < locations.length; i++) {
          const { dataValues } = locations[i];
          
          const totalPopulation = dataValues.male + dataValues.female;
          
          dataValues['totalPopulation'] = totalPopulation;
          if (dataValues.parentLocation !== null) {
            subLocations.push(dataValues)
          } else {
            mainLocation = dataValues;
          }
        }
        mainLocation['subLocations'] = subLocations;
        return res.status(200).send({ locations: mainLocation });
      } else {
        return res.status(200).send({ message: 'No locations found' });
      }
    })
    .catch(e => res.status(400).send({ message: e.errors[0].message || e }));
  },

  updateLocation(req, res) {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ message: 'Request cannot be empty' });
    };

    const { locationId } = req.params;
    const { parentLocation } = req.body;

    const updateLocation = () => Location.update(req.body, {
      where: { id: locationId }
    })
    .then(locat => {
      if (locat) {
        return res.status(200).send({
          message: 'Location updated successfully'
        });
      }
    })
    .catch(e => res.status(404).send({ message: e.errors[0].message || e }));

    return Location.findById(locationId)
    .then(location => {
      if (!location) return res.status(400).send({ message: 'Location not found' })

      if (parentLocation) {
        Location.findById(parentLocation)
        .then((loc) => {
          if (loc) {
            updateLocation();
          } else {
            return res.status(400).send({ message: 'Parent Location not found' });
          }
        }) 
        .catch(e => res.status(400).send({ message: e.errors[0].message || e }));
      } else {
        updateLocation();
      }
    })
  },

  deleteLocation(req, res) {
    const { locationId } = req.params;
    if (isNaN(locationId)) return res.status(400).send({ message: 'Invalid parent location id' })

    return Location.findById(locationId)
    .then(location => {
      if (!location) return res.status(404).send({ message: 'Location not found' })

      return location.destroy({
        where: { id: req.params.locationId }
      })
      .then(() => {
        Location.findAll({ where: { parentLocation: req.params.locationId }})
        .then(locations => locations.forEach(loc => loc.updateAttributes({ parentLocation: null })));
        return res.status(200).send({
          message: 'Location successfully deleted.'
       });
      })
      .catch(e => res.status(400).send({ message: e.errors[0].message || e }));
    })
  }
}
