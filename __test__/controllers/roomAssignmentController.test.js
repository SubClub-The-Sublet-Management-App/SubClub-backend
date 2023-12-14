const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const {app} = require('../../src/server')
const User = require('../../src/models/userModel');
const RoomAssignment = require('../../src/models/roomAssignmentModel');

describe('User Controller', () => {
    let token, user, roomAssignmentId, userIdString;

    beforeAll(async () => {
        // Conection to the DB
        await mongoose.connect(process.env.DB_URI);

        // Create user for testing purpuses
        user = new User({ 
            firstName: 'Tess',
            lastName: 'Tester',
            email: 'tester003@mail.com',
            password: 'StrongPassword123!',

        });
        await user.save();
        userIdString = user._id.toString();

        // user login
        const response = await request(app)
        .post('/auth/login') 
        .send({
            email: 'tester003@mail.com',
            password: 'StrongPassword123!',
        });

        token = response.body.token;

        //Create a room assignment for the test
        const roomAssignment = await request(app)
        .post('/room-assignments/')
        .set('Authorization', `Bearer ${token}`)
        .send({
            room:'1233e83563354932dc3d6889',
            occupant: '1234563563354932dc3d6889',
            startDate: new Date(),
            endDate: new Date(),
            rentInclusions: ['bills', 'internet', 'parking'],
            rentalPayment: 800,
            rentalPaymentFrequency: 'Monthly',
            securityDeposit: 1600,
        });

        roomAssignmentId = roomAssignment._body.data._id;
        console.log(roomAssignment)
    });

    afterAll(async () => {
        // Delete the specific user that was created during the test
        await RoomAssignment.deleteMany({ user: userIdString});
        await User.findByIdAndDelete(userIdString);      
    
        // Close the database connection
        await mongoose.connection.close();
    });

    // Test for post operations
    it('should create a new room assignment', async () => {

        // Send post request
        const response = await request(app)
            .post('/room-assignments/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                room: '1234567893354932dc3d6889',
                occupant: '1234567890124932dc3d6889',
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-06-01'),
                rentInclusions: ['bills', 'internet', 'parking'],
                rentalPayment: 500,
                rentalPaymentFrequency: 'monthly',
                securityDeposit: 1000,
            });

        // Verify request response
        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('message', 'Successfully created a new room assignment');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('room', '1234567893354932dc3d6889');
        expect(response.body.data).toHaveProperty('occupant', '1234567890124932dc3d6889');
        expect(new Date(response.body.data.startDate)).toEqual(new Date('2024-01-01'));
        expect(new Date(response.body.data.endDate)).toEqual(new Date('2024-06-01'));
        expect(response.body.data).toHaveProperty('rentInclusions', ['bills', 'internet', 'parking']);
        expect(response.body.data).toHaveProperty('rentalPaymentFrequency', 'monthly');
        expect(response.body.data).toHaveProperty('rentalPayment', 500);
        expect(response.body.data).toHaveProperty('securityDeposit', 1000);
        expect(response.body.data).not.toHaveProperty('user');

        const createdRoomAssignmentId = response.body.data._id

        // Check that room assignment exist on the DB
        const createdRoomAssignment = await RoomAssignment.findById(createdRoomAssignmentId);
        expect(createdRoomAssignment.rentalPayment).toEqual(500);
        expect(createdRoomAssignment.securityDeposit).toEqual(1000);
    });

    // Test for Read operation
    it('should get all room assignments', async () => {
        // Send get request
        const response = await request(app)
        .get('/room-assignments/')
        .set('Authorization', `Bearer ${token}`)

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully retrieved all room assignments');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual(expect.arrayContaining([expect.objectContaining({})]));
        expect(response.body.data.length).toBe(2);
    });

    //Test for read operation by ID
    it('should get room assignment by id', async () => {

        // Send get requets
        const response = await request(app)
        .get(`/room-assignments/${roomAssignmentId}`)
        .set('Authorization', `Bearer ${token}`);

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully retrieved room assignment by id');
        expect(response.body).toHaveProperty('data');

        // Verify that room assignment exist on the DB
        const existingRoomAssignment = await RoomAssignment.findById(roomAssignmentId);
        expect(existingRoomAssignment.rentalPayment).toEqual(800);
        expect(existingRoomAssignment.securityDeposit).toEqual(1600);
    });

    //Test for update operation by ID
    it('should update room assignment by id - test for cancel a room assignment', async () => {

        // Send get requets
        const response = await request(app)
        .patch(`/room-assignments/${roomAssignmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            isActive:false
        })

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully updated the room assignment');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('isActive', false);
  
        // Verify that room assignment data got updated on the DB
        const updatedRoomAssignment = await RoomAssignment.findById(roomAssignmentId)
        expect(updatedRoomAssignment.isActive).toEqual(false)
    });
}); 