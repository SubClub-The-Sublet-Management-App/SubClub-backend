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
        const response = await request(app)
        .post('/auth/login') 
        .send({
            email: 'tester001@mail.com',
            password: 'StrongPassword123!',
        });

        token = response.body.token;
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
        const response = await request(app)
            .post('/rooms/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Room01',
                monthlyRentalPrice: 500,
                description: 'A cozy room',
                content: ['Bed', 'Table', 'Chair']
            });
    
        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('message', 'Successfully created a new room');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name', 'Room01');
        expect(response.body.data).toHaveProperty('monthlyRentalPrice', 500);
        expect(response.body.data).toHaveProperty('description', 'A cozy room');
        expect(response.body.data).toHaveProperty('content', ['Bed', 'Table', 'Chair']);
        expect(response.body.data).not.toHaveProperty('user');
    });


    // Test for Read operation
    it('should fetch rooms', async () => {
        // Use the .set() method to set headers (for authentication)
        const response = await request(app)
        .get('/rooms/')
        .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully retrieved all rooms');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual(expect.arrayContaining([expect.objectContaining({})]));
    });

    //Test for read operation by ID
    it('should fetch rooms by id', async () => {

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
        const response = await request(app)
        .get(`/rooms/${room._body.data._id}`)
        .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully retrieved the room by id');
        expect(response.body).toHaveProperty('data');

    });


    //Test for update operation by ID
    it('should fetch and update room by id', async () => {
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
        const response = await request(app)
        .patch(`/rooms/${room._body.data._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            name:'The best room',
            monthlyRentalPrice: 1000,
        });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully updated the room');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name', 'The best room');
        expect(response.body.data).toHaveProperty('monthlyRentalPrice', 1000);

    });

    //Test for delete operation by ID
    it('should fetch and delete room by id', async () => {
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
        const response = await request(app)
        .delete(`/rooms/${room._body.data._id}`)
        .set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully deleted the room');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name', 'Room002');
        expect(response.body.data).toHaveProperty('monthlyRentalPrice', 500);
        expect(response.body.data).toHaveProperty('description', 'A cozy room');
        expect(response.body.data).toHaveProperty('content', ['Bed', 'Table', 'Chair']);
    });


}); 