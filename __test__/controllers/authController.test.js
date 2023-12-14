const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const {app} = require('../../src/server')
const User = require('../../src/models/userModel');


describe('Auth Controller for signup and login', () => {
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
        const response = await request(app)
            .post('/auth/signup')
            .send({
                firstName: 'Tess',
                lastName: 'Tester',
                email: 'tester100@mail.com',
                password: 'Password1234!',
            });

        createdUserIds.push(response.body.userObj._id);
        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully');
        expect(response.body).toHaveProperty('userObj');
        expect(response.body.userObj).toHaveProperty('firstName', 'Tess');
        expect(response.body.userObj).toHaveProperty('lastName', 'Tester');
        expect(response.body.userObj).toHaveProperty('email', 'tester100@mail.com');
        expect(response.body.userObj).not.toHaveProperty('password');
    });

    // Test for weak password
    it('returns error when password is not strong enough', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser@mail.com',
                password: 'weak',
            });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty('message', 'Password is not strong enough');
    });

    // Test for missing fields
    it('returns error when a required field is missing', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser@mail.com',
                // password field is missing
            });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty('message', 'Password is required');
    });

    // Test for invalid email
    it('returns error when email is invalid', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'invalidemail',
                password: 'StrongPassword123',
            });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty('message', 'Invalid email format');
    });

    // Test for email already in use
    it('returns error when email is already in use', async () => {
        // First, create a user with the email
        const user1 = await request(app)
            .post('/auth/signup')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser@mail.com',
                password: 'StrongPassword123!',
            });

        // Then, try to create another user with the same email
        const response = await request(app)
            .post('/auth/signup')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser@mail.com',
                password: 'StrongPassword123!',
            });

        createdUserIds.push(user1.body.userObj._id);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty('message', 'Email already in use');
    });


    // Test for missing fields
    it('returns error when a required field is missing', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@mail.com',
                // password field is missing
            });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty('message', 'Password is required');
    });

    // Test for invalid email
    it('throws an error when email is not registered', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'nonexistent@mail.com',
                password: 'StrongPassword123!',
            });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty('message', 'Invalid email');
    });

    // Test for invalid password
    it('throws an error when password is incorrect', async () => {
        // First, create a user with the email and password
        const user1= await request(app)
            .post('/auth/signup')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser1000@mail.com',
                password: 'StrongPassword123!',
            });

        // Then, try to log in with the correct email but incorrect password
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser1000@mail.com',
                password: 'IncorrectPassword',
            });
        
        createdUserIds.push(user1.body.userObj._id);
        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty('message', 'Invalid password');
    });

    // Test for successful login
    it('logs in successfully with correct email and password', async () => {
        // First, create a user with the email and password
        const user1 = await request(app)
            .post('/auth/signup')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser2023@mail.com',
                password: 'StrongPassword123!',
            });
        
        // Then, try to log in with the correct email and password
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser2023@mail.com',
                password: 'StrongPassword123!',
            });
        
        createdUserIds.push(user1.body.userObj._id);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Logged in successfully');
        expect(response.body).toHaveProperty('token');
    });

});

