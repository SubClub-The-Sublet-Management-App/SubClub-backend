const request = require('supertest');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const {app} = require('../../src/server')
const User = require('../../src/models/userModel');


describe('User Controller', () => {
    beforeAll(async () => {
        // Conection to the DB
        await mongoose.connect(process.env.DB_URI);
    });

     // save user id's to delete after test
     let createdUserIds = [];

    afterAll(async () => {
        // Delete all users created during the test
        for (let userId of createdUserIds) {
            await User.findByIdAndDelete(userId);
        }
    
        // Close the database connection
        await mongoose.connection.close();
    });

     // Test for Create operation
     it('should create a new user', async () => {
        const res = await request(app)
            .post('/auth/signup')
            .send({
                firstName: 'Tess',
                lastName: 'Tester',
                email: 'tester100@mail.com',
                password: 'Password1234!',
            });
        console.log(res.error)
        createdUserIds.push(res.body.userObj._id);
        expect(res.statusCode).toEqual(201);
        expect(res.body.userObj.firstName).toEqual('Tess');
    });


});