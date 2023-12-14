const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const {app} = require('../../src/server')
const User = require('../../src/models/userModel');
const PaymentRecord = require('../../src/models/paymentRecordModel');
const RoomAssignment = require('../../src/models/roomAssignmentModel');

describe('User Controller', () => {
    let token, user, paymentRecordId, userIdString, paymentRecord1, roomAssignmentId;

    beforeAll(async () => {
        // Conection to the DB
        await mongoose.connect(process.env.DB_URI);

        // Create user for testing purpuses
        user = new User({ 
            firstName: 'Tess',
            lastName: 'Tester',
            email: 'tester004@mail.com',
            password: 'StrongPassword123!',

        });
        await user.save();
        userIdString = user._id.toString();

        // user login
        const response = await request(app)
        .post('/auth/login') 
        .send({
            email: 'tester004@mail.com',
            password: 'StrongPassword123!',
        });

        token = response.body.token;

        //Create a room assignment for the test
        const roomAssignmentTest = await request(app)
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

        roomAssignmentId = roomAssignmentTest._body.data._id;

        //Create a payment record for the test
        paymentRecord = await request(app)
        .post('/payment-records/')
        .set('Authorization', `Bearer ${token}`)
        .send({
            roomAssignment: roomAssignmentId,
            paymentType: 'Cash',
            amountPaid: 800,
            paymentPeriodStart: new Date('2024-03-01'),
            paymentPeriodEnd: new Date('2024-03-31'),
            nextPaymentDate: new Date('2024-04-01')
        });

        paymentRecordId = paymentRecord._body.data._id;
    });

    afterAll(async () => {
        // Delete the specific user that was created during the test
        await PaymentRecord.deleteMany({ user: userIdString});
        await RoomAssignment.deleteMany({ user: userIdString});
        await User.findByIdAndDelete(userIdString);      
    
        // Close the database connection
        await mongoose.connection.close();
    });

    // Test for post operations
    it('should create a new payment record', async () => {

        // Send post request
        const response = await request(app)
            .post('/payment-records/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                roomAssignment: roomAssignmentId,
                paymentType: 'Cash',
                amountPaid: 800,
                paymentPeriodStart: new Date('2024-04-01'),
                paymentPeriodEnd: new Date('2024-05-01'),
                nextPaymentDate: new Date('2024-05-02')
            });

        // Verify request response
        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('message', 'Successfully created a new payment record');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('roomAssignment', roomAssignmentId);
        expect(response.body.data).toHaveProperty('paymentType', 'Cash');
        expect(response.body.data).toHaveProperty('amountPaid', 800);
        expect(new Date(response.body.data.paymentPeriodStart)).toEqual(new Date('2024-04-01'));
        expect(new Date(response.body.data.paymentPeriodEnd)).toEqual(new Date('2024-05-01'));
        expect(new Date(response.body.data.nextPaymentDate)).toEqual(new Date('2024-05-02'));
        expect(response.body.data).not.toHaveProperty('user');

        const createdPaymentRecordId = response.body.data._id
        
        // Check that room assignment exist on the DB
        const createdPaymentRecord = await PaymentRecord.findById(createdPaymentRecordId);
        expect(createdPaymentRecord.paymentPeriodStart).toEqual(new Date('2024-04-01'));
        expect(createdPaymentRecord.paymentPeriodEnd).toEqual(new Date('2024-05-01'));
        expect(createdPaymentRecord.paymentType).toEqual('Cash');

    });

    // Test for Read operation
    it('should get all payment records', async () => {
        // Send get request
        const response = await request(app)
        .get('/payment-records/')
        .set('Authorization', `Bearer ${token}`)

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully retrieved all payment records');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual(expect.arrayContaining([expect.objectContaining({})]));
        expect(response.body.data.length).toBe(2);
    });

    //Test for read operation by ID
    it('should get payment record by id', async () => {

        // Send get requets
        const response = await request(app)
        .get(`/payment-records/${paymentRecordId}`)
        .set('Authorization', `Bearer ${token}`);

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully retrieved payment record');
        expect(response.body).toHaveProperty('data');

        // Verify that payment record exist on the DB
        const existingPaymentRecord = await PaymentRecord.findById(paymentRecordId);
        expect(existingPaymentRecord.paymentPeriodStart).toEqual(new Date('2024-03-01'));
        expect(existingPaymentRecord.paymentPeriodEnd).toEqual(new Date('2024-03-31'));
    });

    //Test for update operation by ID
    it('should update payment record by id - test for cancel a payment record', async () => {

        // Send get requets
        const response = await request(app)
        .patch(`/payment-records/${paymentRecordId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            isActive:false
        })

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully cancelled payment record');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('isActive', false);
  
        // Verify that room assignment data got updated on the DB
        const updatedPaymentRecord = await PaymentRecord.findById(paymentRecordId)
        expect(updatedPaymentRecord.isActive).toEqual(false)
    });
}); 