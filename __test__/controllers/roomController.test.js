const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const {app} = require('../../src/server')
const User = require('../../src/models/userModel');
const Room = require('../../src/models/roomModel');

describe('User Controller', () => {
    let token, user;

    beforeAll(async () => {
        // Conection to the DB
        await mongoose.connect(process.env.DB_URI);

        // Create user for testing purpuses
        user = new User({ 
            firstName: 'Tess',
            lastName: 'Tester',
            email: 'tester001@mail.com',
            password: 'StrongPassword123!',

        });
        await user.save();
        userIdString = user._id.toString();

        // user login
        const res = await request(app)
        .post('/auth/login') 
        .send({
            email: 'tester001@mail.com',
            password: 'StrongPassword123!',
        });

        token = res.body.token;
    });

    afterAll(async () => {
        // Delete the specific user that was created during the test
        await Room.deleteMany({ user: userIdString});
        await User.findByIdAndDelete(userIdString);
        
    
        // Close the database connection
        await mongoose.connection.close();
    });

    
    it('should create a new room', async () => {
        // Use the .set() method to set headers (for authentication)
        const res = await request(app)
            .post('/rooms/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Room01',
                monthlyRentalPrice: 500,
                description: 'A cozy room',
                content: ['Bed', 'Table', 'Chair']
            });
    
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Successfully created a new room');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('name', 'Room01');
        expect(res.body.data).toHaveProperty('monthlyRentalPrice', 500);
        expect(res.body.data).toHaveProperty('description', 'A cozy room');
        expect(res.body.data).toHaveProperty('content', ['Bed', 'Table', 'Chair']);
        expect(res.body.data).not.toHaveProperty('user');
    });


    // Test for Read operation
    it('should fetch a user rooms', async () => {
        // Use the .set() method to set headers (for authentication)
        const res = await request(app)
        .get('/rooms/')
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Successfully retrieved all rooms');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toEqual(expect.arrayContaining([expect.objectContaining({})]));
    });

    //Test for read operation by ID
    it('should fetch a user rooms by id', async () => {

        //Create a room for test
        const room = await request(app)
        .post('/rooms/')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Room0101',
            monthlyRentalPrice: 500,
            description: 'A cozy room',
            content: ['Bed', 'Table', 'Chair']
        });

        // Use the .set() method to set headers (for authentication)
        const res = await request(app)
        .get(`/rooms/${room._body.data._id}`)
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Successfully retrieved the room by id');
        expect(res.body).toHaveProperty('data');

    });


    //Test for update operation by ID
    it('should fetch and update a user room by id', async () => {
        //Create a room for test
        const room = await request(app)
        .post('/rooms/')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Room002',
            monthlyRentalPrice: 500,
            description: 'A cozy room',
            content: ['Bed', 'Table', 'Chair']
        });

        // Send patch request
        const res = await request(app)
        .patch(`/rooms/${room._body.data._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            name:'The best room',
            monthlyRentalPrice: 1000,
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Successfully updated the room');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('name', 'The best room');
        expect(res.body.data).toHaveProperty('monthlyRentalPrice', 1000);

    });

    //Test for delete operation by ID
    it('should fetch and delete a user room by id', async () => {
        //Create a room for test
        const room = await request(app)
        .post('/rooms/')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Room002',
            monthlyRentalPrice: 500,
            description: 'A cozy room',
            content: ['Bed', 'Table', 'Chair']
        });

        // send delete recuest
        const res = await request(app)
        .delete(`/rooms/${room._body.data._id}`)
        .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Successfully deleted the room');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('name', 'Room002');
        expect(res.body.data).toHaveProperty('monthlyRentalPrice', 500);
        expect(res.body.data).toHaveProperty('description', 'A cozy room');
        expect(res.body.data).toHaveProperty('content', ['Bed', 'Table', 'Chair']);
    });


}); 