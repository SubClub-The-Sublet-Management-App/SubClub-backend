const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const {app} = require('../../src/server')
const User = require('../../src/models/userModel');
const Room = require('../../src/models/roomModel');

describe('Room Controller', () => {
    let token, user, roomId, userIdString;

    beforeAll(async () => {
        // Conection to the DB
        await mongoose.connect(process.env.DB_URI);

        // Create user for the test
        user = new User({ 
            firstName: 'Tess',
            lastName: 'Tester',
            email: 'tester100000@mail.com',
            password: 'StrongPassword123!',
        });
        await user.save();
        userIdString = user._id.toString();

        // user login
        const response = await request(app)
        .post('/auth/login') 
        .send({
            email: 'tester100000@mail.com',
            password: 'StrongPassword123!',
        });

        token = response.body.token;

        // Create a room for test
        const room = await request(app)
        .post('/rooms/')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Room for test',
            monthlyRentalPrice: 500,
            description: 'A cozy room',
            content: ['Bed', 'Table', 'Chair']
        });
        roomId =room.body.data._id;
               
    });



    afterAll(async () => {
        // Delete the specific user that was created during the test
        await Room.deleteMany({ user: userIdString});
        await User.findByIdAndDelete(userIdString);
        
        // Close the database connection
        await mongoose.connection.close();
    });


    // Test for post operations
    it('should create a new room', async () => {

        // Send post request
        const response = await request(app)
            .post('/rooms/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Room01',
                monthlyRentalPrice: 500,
                description: 'A cozy room',
                content: ['Bed', 'Table', 'Chair']
            });
    
        // Verify request response
        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('message', 'Successfully created a new room');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name', 'Room01');
        expect(response.body.data).toHaveProperty('monthlyRentalPrice', 500);
        expect(response.body.data).toHaveProperty('description', 'A cozy room');
        expect(response.body.data).toHaveProperty('content', ['Bed', 'Table', 'Chair']);
        expect(response.body.data).not.toHaveProperty('user');

        const createdRoomId = response.body.data._id

        // Verify that created room exist on the DB
        const createdRoom = await Room.findById(createdRoomId);
        expect(createdRoom.name).toEqual('Room01');
    });

    // Test for Read operation
    it('should fetch rooms', async () => {
        // Use the .set() method to set headers (for authentication)
        const response = await request(app)
        .get('/rooms/')
        .set('Authorization', `Bearer ${token}`)

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully retrieved all rooms');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual(expect.arrayContaining([expect.objectContaining({})]));
    });

    //Test for read operation by ID
    it('should get room by id', async () => {
        // Send get request
        const response = await request(app)
        .get(`/rooms/${roomId}`)
        .set('Authorization', `Bearer ${token}`)

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully retrieved the room by id');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name', 'Room for test');

        // Verify that room exist on the DB
        const existingRoom = await Room.findById(roomId);
        expect(existingRoom.name).toEqual('Room for test');
    });

    //Test for update operation by ID
    it('should fetch and update room by id', async () => {
        
        // Send patch request
        const response = await request(app)
        .patch(`/rooms/${roomId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            name:'The best room',
            monthlyRentalPrice: 1000,
        });

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully updated the room');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name', 'The best room');
        expect(response.body.data).toHaveProperty('monthlyRentalPrice', 1000);

        // Verify that room data got updated on the DB
        const updatedRoom = await Room.findById(roomId);
        expect(updatedRoom.name).toEqual('The best room');      
    });

    //Test for delete operation by ID
    it('should fetch and delete room by id', async () => {

        // send delete request
        const response = await request(app)
        .delete(`/rooms/${roomId}`)
        .set('Authorization', `Bearer ${token}`)


        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully deleted the room');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name', 'The best room');
        expect(response.body.data).toHaveProperty('monthlyRentalPrice', 1000);
        expect(response.body.data).toHaveProperty('description', 'A cozy room');
        expect(response.body.data).toHaveProperty('content', ['Bed', 'Table', 'Chair']);

        // Check that room got deleted from the DB
        const deletedRoom = await Room.findById(roomId);
        expect(deletedRoom).toEqual(null);
    });
}); 