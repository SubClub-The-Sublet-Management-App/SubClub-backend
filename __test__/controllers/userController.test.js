const request = require('supertest');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const {app} = require('../../src/server')

const User = require('../../src/models/userModel');
const { replace } = require('lodash');

describe('User Controller', () => {
    beforeAll(async () => {
        // Conection to the DB
        await mongoose.connect(process.env.DB_URI);

        // Create user for testing purpuses
        user = new User({ 
            firstName: 'Tess',
            lastName: 'Tester',
            email: 'tester123@mail.com',
            password: 'password',

        });
        await user.save();
        userIdString = user._id.toString();

    });


    afterAll(async () => {
        // Delete the specific user that was created during the test
        await User.findByIdAndDelete(user._id);
    
        // Close the database connection
        await mongoose.connection.close();
    });

    // conver id to string
    
    

    // Test for Read operation
    it('should fetch a user', async () => {

        const res = await request(app).get( `/users/${userIdString}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(userIdString);

        
    });

    // Test for Update operation
    it('should update a user', async () => {
        const res = await request(app)
            .patch(`/users/${userIdString}`)
            .send({
                firstName: 'New name',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.firstName).toEqual('New name');
    });

    // Test for Delete operation
    it('should delete a user', async () => {
        const res = await request(app).delete(`/users/${userIdString}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User deleted successfully');
    });
});