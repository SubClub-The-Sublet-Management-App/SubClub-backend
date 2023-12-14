const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const {app} = require('../../src/server')
const User = require('../../src/models/userModel');
const Occupant = require('../../src/models/occupantModel');

describe('User Controller', () => {
    let token, user, occupantId, userIdString;

    beforeAll(async () => {
        // Conection to the DB
        await mongoose.connect(process.env.DB_URI);

        // Create user for testing purpuses
        user = new User({ 
            firstName: 'Tess',
            lastName: 'Tester',
            email: 'tester002@mail.com',
            password: 'StrongPassword123!',

        });
        await user.save();
        userIdString = user._id.toString();

        // user login
        const response = await request(app)
        .post('/auth/login') 
        .send({
            email: 'tester002@mail.com',
            password: 'StrongPassword123!',
        });

        token = response.body.token;

        //Create a occupant for test
        const occupant = await request(app)
        .post('/occupants/')
        .set('Authorization', `Bearer ${token}`)
        .send({
            firstName: 'Test',
            lastName: 'Testing',
            email: 'test-occupant-1@mail.com',
            phoneNumber: '1234567890',
            dob: '1991-01-01',
            occupation: 'Engineer',
            emergencyContact: {
                firstName: 'Tess',
                lastName: 'Tester',
                phoneNumber: '0987654321',
                relationship: 'Spouse',
                email: 'tester-tess@mail.com',
            },
            reference: {
                firstName: 'Another',
                lastName: 'Test',
                phoneNumber: '1122334455',
                relationship: 'Friend',
                email:'a-test@mail.com'
            },
        });

        occupantId =occupant._body.data._id;
    });

    afterAll(async () => {
        // Delete the specific user that was created during the test
        await Occupant.deleteMany({ user: userIdString});
        await User.findByIdAndDelete(userIdString);
        
    
        // Close the database connection
        await mongoose.connection.close();
    });

    
    it('should create a new occupant', async () => {
        // Send post request
        const response = await request(app)
            .post('/occupants/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName: 'Test',
                lastName: 'Testing',
                email: 'test-occupant@mail.com',
                phoneNumber: '1234567890',
                dob: '1991-01-01',
                occupation: 'Engineer',
                emergencyContact: {
                    firstName: 'Tess',
                    lastName: 'Tester',
                    phoneNumber: '0987654321',
                    relationship: 'Spouse',
                    email: 'tester-tess@mail.com',
                },
                reference: {
                    firstName: 'Another',
                    lastName: 'Test',
                    phoneNumber: '1122334455',
                    relationship: 'Friend',
                    email:'a-test@mail.com'
                },
            });
        // Verify request response
        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('message', 'Successfully created a new Occupant');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('firstName', 'Test');
        expect(response.body.data).toHaveProperty('lastName', 'Testing');
        expect(response.body.data).toHaveProperty('email', 'test-occupant@mail.com');
        expect(response.body.data).toHaveProperty('phoneNumber', '1234567890');
        expect(new Date(response.body.data.dob)).toEqual(new Date('1991-01-01'));
        expect(response.body.data).toHaveProperty('occupation', 'Engineer');
        expect(response.body.data.emergencyContact).toEqual(expect.objectContaining({}));
        expect(response.body.data.reference).toEqual(expect.objectContaining({}));
        expect(response.body.data).not.toHaveProperty('user');

        const createdOccupantId = response.body.data._id

        // Check that occupant exist on the DB
        const updatedOccupant = await Occupant.findById(createdOccupantId);
        expect(updatedOccupant.email).toEqual('test-occupant@mail.com');

    });


    // Test for Read operation
    it('should get all occupants', async () => {
        // Send get request
        const response = await request(app)
        .get('/occupants/')
        .set('Authorization', `Bearer ${token}`)

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully retrieved all Occupants');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual(expect.arrayContaining([expect.objectContaining({})]));
    });

    //Test for read operation by ID
    it('should get occupant by id', async () => {

        // Sent get requets
        const response = await request(app)
        .get(`/occupants/${occupantId}`)
        .set('Authorization', `Bearer ${token}`);

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully retrieved the occupant by id');
        expect(response.body).toHaveProperty('data');

        // Verify that occupant exist on the DB
        const existingOccupant = await Occupant.findById(occupantId);
        expect(existingOccupant.firstName).toEqual('Test');

    });


    //Test for update operation by ID
    it('should update occupant by id', async () => {

        // Send get requets
        const response = await request(app)
        .patch(`/occupants/${occupantId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            firstName: "Test100",
            emergencyContact:{email: 'tester10000@mail.com'}
        })

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully updated the occupant');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('firstName', 'Test100');
        expect(response.body.data.emergencyContact.email).toEqual('tester10000@mail.com');

        // Verify that occupant data got updated on the DB
        const updatedOccupant = await Occupant.findById(occupantId)
        expect(updatedOccupant.firstName).toEqual('Test100')
        
    });

    // Test for delete operation by ID
    it('should delete occupant by id', async () => {

        // Send delete recuest
        const response = await request(app)
        .delete(`/occupants/${occupantId}`)
        .set('Authorization', `Bearer ${token}`)

        // Verify request response
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Successfully deleted the occupant');
        expect(response.body).toHaveProperty('data');

        // Verify that the occupant got deleted from the DB
        const deletedOccupant = await Occupant.findById(occupantId)
        expect(deletedOccupant).toEqual(null)

    });


}); 