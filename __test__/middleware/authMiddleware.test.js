const request = require('supertest');
const express = require('express');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/userModel');
const authMiddleware = require('../../src/middleware/authMiddleware');

describe('authMiddleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(authMiddleware);
    app.get('/test', (req, res) => res.status(200).json({ message: 'Success' }));
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 401 if no Authorization header is present', async () => {
    const response = await request(app).get('/test');
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 if token is not valid', async () => {
    sinon.stub(jwt, 'verify').throws();
    const response = await request(app).get('/test').set('Authorization', 'Bearer invalid_token');
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 if user is not found', async () => {
    sinon.stub(jwt, 'verify').returns({ userId: '65714d8cc56d29f71d95def0' }); // invalid user id
    sinon.stub(User, 'findById').resolves(null);
    const response = await request(app).get('/test').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTcxNGQ4Y2M1NmQyOWY3MWQ5NWRlZmQiLCJpYXQiOjE3MDIxNzU1ODUsImV4cCI6MTcwMjI2MTk4NX0.HU-QvoVVyDFzgHhFVyCM8zhjCdfZmAurBA1m0wM8NZ0');
    expect(response.statusCode).toBe(401);
  });

  it('should call next() if Authorization header is present and token is valid', async () => {
    sinon.stub(jwt, 'verify').returns({ userId: '65714d8cc56d29f71d95defd' });// valid user id
    sinon.stub(User, 'findById').resolves({ _id: '65714d8cc56d29f71d95defd' });
    const response = await request(app).get('/test').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTcxNGQ4Y2M1NmQyOWY3MWQ5NWRlZmQiLCJpYXQiOjE3MDIxNzU1ODUsImV4cCI6MTcwMjI2MTk4NX0.HU-QvoVVyDFzgHhFVyCM8zhjCdfZmAurBA1m0wM8NZ0');
    expect(response.statusCode).toBe(200);
  });
});

