[![Build Status](https://travis-ci.org/mbilesanmi/mai-pms.svg?branch=master)](https://travis-ci.org/mbilesanmi/mai-pms)

# PMS API
Population Management System (PMS) API

* Access the hosted application on Heroku using this [link](https://mai-pms.herokuapp.com/). 
* PMS API Route documentation can be found [here](https://maipms.docs.apiary.io)

### Features
---

* Users can create a location.
* Users can get a location.
* Users can get all locations.
* Users can edit a location.
* Users can delete a location.

**Authorization**:
No authorization required

### Endpoints
---

Access the hosted application on Heroku using this [link](https://mai-pms.herokuapp.com/). 

Below are the collection of routes.


#### LOCATION

EndPoint                          |   Functionality    
----------------------------------|--------------------------------------------
POST /locations                   | Create a location
GET /locations/                   | Gets all locations
GET /locations/:parentLocation    | Gets a location with its sub-locations
PUT /location/:locationId         | Update a location
DELETE /location/:locationId      | Delete a location
GET /location/locationId          | Get a location

### Technologies Used
---

- Node.js
- Express
- Sequelize


### Installation
---

- Clone the project repository.
- Run the command below to clone:
> git clone https://github.com/mbilesanmi/mai-pms.git.
- Change directory into the mai-sms directory.
- Install all necessary packages in the package.json file. Depending on if you are using `yarn`, you can use the command below:
> yarn install
- Create a postgresql database and fill its details into your env like in the .env.sample file.
- Run sequelize migrate command below:
> sequelize db:migrate
- Run the command below to start the application locally:
> yarn start:dev
- Test the routes above on POSTMAN or any other application of choice


#### Contributing
---

1. Fork this repository to your account.
2. Clone your repository: git clone https://github.com/mbilesanmi/mai-pms.git.
4. Commit your changes: git commit -m "did something".
5. Push to the remote branch: git push origin new-feature.
6. Open a pull request.

#### Licence
---

ISC

Copyright (c) 2018 Maranatha A Ilesanmi
