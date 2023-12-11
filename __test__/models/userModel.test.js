const mongoose = require('mongoose');
const mongodb = require('mongodb');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../../src/models/userModel');

describe('User Model Test', () => {
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

    // Test for valid data
    it('create & save user successfully', async () => {
        const userData = {
            firstName: 'Hugh-N',
            lastName: 'Cry',
            dob: new Date('1990-01-01'),
            email: 'hugh@mail.com',
            password: 'password',
            phoneNumber: '1234567890',
            address: {
                street: 'Main St',
                number: 123,
                city: 'City',
                postCode: '12345',
                state: 'State'
            }
        };
        const validUser = new User(userData);
        const savedUser = await validUser.save();
        createdUserIds.push(savedUser._id);

        expect(savedUser._id).toBeDefined();
        expect(savedUser.firstName).toBe(userData.firstName);
        expect(savedUser.lastName).toBe(userData.lastName);
        expect(savedUser.dob).toEqual(userData.dob);
        expect(savedUser.email).toBe(userData.email);
        expect(await bcrypt.compare(userData.password, savedUser.password)).toBe(true);
        expect(savedUser.phoneNumber).toBe(userData.phoneNumber);
        expect(savedUser.address.toObject()).toEqual(expect.objectContaining(userData.address));
    });

    // Test for required data not provided
    it('create user without required field should fail', async () => {
        const userWithoutRequiredField = new User({ firstName: 'Ann' });
        let err;
        try {
            const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
            error = savedUserWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    // Test for duplicated email
    it('throws error when email already exists', async () => {
        let err;
        try {
            const user1 = new User({ 
                firstName: 'Ann',
                lastName: 'Chovey',
                dob: new Date('1990-01-01'),
                email: 'ann123@mail.com',
                password: 'password',
                phoneNumber: '1234567890',
                address: {
                    street: 'Main St',
                    number: 123,
                    city: 'City',
                    postCode: '12345',
                    state: 'State'
                }
            });
            await user1.save();
            createdUserIds.push(savedUser._id);

            const user2 = new User({ 
                firstName: 'Ann',
                lastName: 'Ci',
                dob: new Date('1990-01-01'),
                email: 'ann123@mail.com',
                password: 'password',
                phoneNumber: '1234567890',
                address: {
                    street: 'Main St',
                    number: 123,
                    city: 'City',
                    postCode: '12345',
                    state: 'State'
                }
            });
            await user2.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.mongo.MongoError);
        expect(err.code).toBe(11000);
    });

    // Test for update operations
    it('updates user successfully', async () => {
        const validUser = new User({ 
            firstName: 'Marsha',
            lastName: 'Mellow',
            dob: new Date('1990-01-01'),
            email: 'masha.mellow@mail.com',
            password: 'password',
            phoneNumber: '1234567890',
            address: {
                street: 'Main St',
                number: 123,
                city: 'City',
                postCode: '12345',
                state: 'State'
            }
        });
        const savedUser = await validUser.save();
        savedUser.firstName = 'Jane';
        const updatedUser = await savedUser.save();
        createdUserIds.push(savedUser._id);
        expect(updatedUser.firstName).toBe('Jane');
    });

    // Test for delete operations
    it('deletes user successfully', async () => {
        const validUser = new User({
            firstName: 'Marge',
            lastName: 'Areen',
            dob: new Date('1990-01-01'),
            email: 'marge.areen@mail.com',
            password: 'password',
            phoneNumber: '1234567890',
            address: {
                street: 'Main St',
                number: 123,
                city: 'City',
                postCode: '12345',
                state: 'State'
            }
        });
        const savedUser = await validUser.save();
        await savedUser.deleteOne({ _id: savedUser._id });
        const deletedUser = await User.findById(savedUser._id);
        expect(deletedUser).toBeNull();
    });

    // Test for read operations
    it('reads user successfully', async () => {
        const validUser = new User({ 
            firstName: 'Melody',
            lastName: 'Sunshine',
            dob: new Date('1990-01-01'),
            email: 'm.unshine@mail.com',
            password: 'password',
            phoneNumber: '1234567890',
            address: {
                street: 'Main St',
                number: 123,
                city: 'City',
                postCode: '12345',
                state: 'State'
            }
        });
        const savedUser = await validUser.save();
        const foundUser = await User.findById(savedUser._id);
        createdUserIds.push(savedUser._id);
        expect(foundUser.firstName).toBe(savedUser.firstName);
    });
});