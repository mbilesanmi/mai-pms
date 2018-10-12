import request from 'supertest';
import chai from 'chai';
import app from '../../index';
import db from '../models';

const superRequest = request.agent(app);
const expect = chai.expect;

let location1;
let location2;

describe('LOCATION API', () => {
  before(done => {
    db.Location.create({
      name: 'Lagos',
      zip: 100,
      male: 200000,
      female: 210000
    })
    .then(location => {
      location1 = location;

      db.Location.create({
        name: 'Ikeja',
        zip: 101,
        parentLocation: location1.id,
        male: 20000,
        female: 21000
      })
      .then(loc2 => {
        location2 = loc2;

        done();
      });
    });
  });

  after(done => db.Location.destroy({ where: {} }).then(done()));


  describe('CREATE Location POST /locations', () => {

    it('it should create a new location successfully when relevant data is supplied', done => {
      superRequest.post('/locations')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Osun',
          zip: 200,
          male: 100000,
          female: 100000
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('Location saved successfully');
          expect(res.body.location.name).to.equal('Osun');
          expect(res.body.location.female).to.equal(100000);
          expect(res.body.location.male).to.equal(100000);
          done();
        });
    });

    it('it should not create a new location when the name field is not supplied', done => {
      superRequest.post('/locations')
        .set({ 'content-type': 'application/json' })
        .send({ 
          male: 3000,
          female: 10000
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Location.name cannot be null');
          done();
        });
    });

    it('it should not create a location with invalid parentLocation', done => {
      superRequest.post('/locations')
        .set({ 'content-type': 'application/json' })
        .send({
          name: 'Maryland',
          male: 30000,
          female: 10000,
          parentLocation: 9999
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Parent location not found');
          done();
        });
    });
    
    it('it should create a single location successfully with valid parent location', done => {
      superRequest.post('/locations')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Maryland',
          male: 30000,
          female: 10000,
          zip: 104,
          parentLocation: location1.id
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('Location saved successfully');
          expect(res.body.location.name).to.equal('Maryland');
          expect(res.body.location.female).to.equal(10000);
          expect(res.body.location.male).to.equal(30000);
          expect(res.body.location.parentLocation).to.equal(location1.id);
          done();
        });
    });

    it('it should not create a location when zip already exists', done => {
      superRequest.post('/locations')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Test',
          male: 12232,
          female: 12132,
          zip: location2.zip
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Zip already exists');
          done();
        });
    });

    it('it should not create a location when female population is not an integer', done => {
      superRequest.post('/locations')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Test',
          male: 12232,
          female: 'sdasdd',
          zip: location2.zip
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid female population');
          done();
        });
    });
  });

  describe('GET Location GET /locations', () => {
    it('it should get a location when the locationId is valid', (done) => {
      superRequest.get(`/locations/${location1.id}`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.location.name).to.equal(location1.name);
          expect(res.body.location.female).to.equal(location1.female);
          expect(res.body.location.male).to.equal(location1.male);
          expect(res.body.location.id).to.equal(location1.id);
          done();
        });
    });

    it('it should not get a location when the locationId is invalid', done => {
      superRequest.get('/locations/"invalid"')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Invalid location id');
          done();
        });
    });

    it('it should not get a location when the locationId does not exist', done => {
      superRequest.get('/locations/99999')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Location not found');
          done();
        });
    });
  });
});
