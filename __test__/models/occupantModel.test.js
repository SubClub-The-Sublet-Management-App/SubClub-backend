
const mongoose = require('mongoose');
const mongodb = require('mongodb');
require('dotenv').config();
const Occupant = require('../../src/models/occupantModel');
const User = require('../../src/models/userModel');

describe('Occupant Model Test', () => {
    // Conection to the DB
    beforeAll(async () => {
        await mongoose.connect(process.env.DB_URI);

        user = new User({ 
            firstName: 'Aida',
            lastName: 'Bugg',
            email: 'a-bugg@mail.com',
            password: 'password',

        });
        await user.save();
    });

    afterAll(async () => {
        // Delete the specific user that was created during the test
        await User.findByIdAndDelete(user._id);
    
        // Close the database connection
        await mongoose.connection.close();
    });
    

    // Test for valid data
    it('create & save occupant successfully', async () => {
        const occupantData = {
            firstName: 'Liz',
            lastName: 'Erd',
            email: 'liz-erd@mail.com',
            phoneNumber: '1234567890',
            dob: new Date('1991-01-01'),
            occupation: 'Engineer',
            emergencyContact: {
                firstName: 'Jane',
                lastName: 'Erd',
                phoneNumber: '0987654321',
                relationship: 'Spouse',
                email: 'jane@mail.com',
            },
            reference: {
                firstName: 'Bob',
                lastName: 'Smith',
                phoneNumber: '1122334455',
                relationship: 'Friend',
            },
            user: user._id,
        };
        const validOccupant = new Occupant(occupantData);
        const savedOccupant = await validOccupant.save();

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedOccupant._id).toBeDefined();
        expect(savedOccupant.firstName).toBe(occupantData.firstName);
        expect(savedOccupant.lastName).toBe(occupantData.lastName);
        expect(savedOccupant.email).toBe(occupantData.email);
        expect(savedOccupant.phoneNumber).toBe(occupantData.phoneNumber);
        expect(savedOccupant.dob).toEqual(occupantData.dob);
        expect(savedOccupant.occupation).toBe(occupantData.occupation);
        expect(savedOccupant.emergencyContact).toEqual(occupantData.emergencyContact);
        expect(savedOccupant.reference).toEqual(occupantData.reference);
        expect(savedOccupant.user.toString()).toBe(user._id.toString());
    });

    // Test for required fields
    it('create occupant without required field should failed', async () => {
        const occupantWithoutRequiredField = new Occupant({ firstName: 'John' });
        let err;
        try {
            const savedOccupantWithoutRequiredField = await occupantWithoutRequiredField.save();
            error = savedOccupantWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });


    // Test for unique fields
    it('throws error when email already exists', async () => {
        let err;
        try {
            const occupant1 = new Occupant({ 
                firstName: 'Allie',
                lastName: 'Grater',
                email: 'allie@mail.com',
                phoneNumber: '1234567890',
                dob: new Date('1990-01-01'),
                occupation: 'Teacher',
                emergencyContact: {
                    firstName: 'Dom',
                    lastName: 'Grater',
                    phoneNumber: '0987654321',
                    relationship: 'Brother',
                    email: 'dom@mail.com',
                },
                reference: {
                    firstName: 'Timy',
                    lastName: 'Kelly',
                    phoneNumber: '1122334455',
                    relationship: 'Friend',
                },
                user: user._id,
             });
            await occupant1.save();

            const occupant2 = new Occupant({ 
                firstName: 'Allie',
                lastName: 'Grater',
                email: 'allie@mail.com',
                phoneNumber: '1234567890',
                dob: new Date ('1995-01-01'),
                occupation: 'Artist',
                emergencyContact: {
                    firstName: 'Olive',
                    lastName: 'Tree',
                    phoneNumber: '0987654321',
                    relationship: 'Best Friend',
                    email: 'olive-tree@mail.com',
                },
                reference: {
                    firstName: 'Lynne',
                    lastName: 'Gwistic',
                    phoneNumber: '1122334455',
                    relationship: 'Friend',
                },
                user: user._id,
             });
            await occupant2.save();
        }catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.mongo.MongoError);
        expect(err.code).toBe(11000);
    });

    // Test for field types
    it('throws error when field is wrong type', async () => {
        const occupantWithInvalidField = new Occupant({ 
            firstName: {},
            lastName: 'Erd',
            email: 'liz@mail.com',
            phoneNumber: "1234567890",
            dob: 3010101,
            occupation: 'Engineer',
            emergencyContact: {
                firstName: 'Jane',
                lastName: 'Erd',
                phoneNumber: "987654321",
                relationship: 'Spouse',
                email: 'jane@mail.com',
            },
            reference: {
                firstName: 'Bob',
                lastName: 'Smith',
                phoneNumber: "1122334455",
                relationship: 'Friend',
            },
            user: user._id,
         });
        let err;
        try {
            const savedOccupantWithInvalidField = await occupantWithInvalidField.save();
            error = savedOccupantWithInvalidField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });


    // Test for update operations
    it('updates occupant successfully', async () => {
        const validOccupant = new Occupant({ 
            firstName: 'Hope',
                lastName: 'Furaletter',
                email: 'hope-furaletter@mail.com',
                phoneNumber: '1234567890',
                dob: new Date('1990-01-01'),
                occupation: 'Teacher',
                emergencyContact: {
                    firstName: 'Dom',
                    lastName: 'Grater',
                    phoneNumber: '0987654321',
                    relationship: 'Best Friend',
                    email: 'dom@mail.com',
                },
                reference: {
                    firstName: 'Timy',
                    lastName: 'Kelly',
                    phoneNumber: '1122334455',
                    relationship: 'Friend',
                },
                user: user._id,
         });
        const savedOccupant = await validOccupant.save();
        savedOccupant.firstName = 'Jane';
        const updatedOccupant = await savedOccupant.save();
        expect(updatedOccupant.firstName).toBe('Jane');
    });

    // Test for delete operations
    it('deletes occupant successfully', async () => {
        const validOccupant = new Occupant({
            firstName: 'B.',
            lastName: 'Homesoon',
            email: 'b-homesoon@mail.com',
            phoneNumber: '1234567890',
            dob: new Date('1990-01-01'),
            occupation: 'Teacher',
            emergencyContact: {
                firstName: 'Dom',
                lastName: 'Grater',
                phoneNumber: '0987654321',
                relationship: 'Best Friend',
                email: 'dom@mail.com',
            },
            reference: {
                firstName: 'Timy',
                lastName: 'Kelly',
                phoneNumber: '1122334455',
                relationship: 'Friend',
            },
            user: user._id,
        });
        const savedOccupant = await validOccupant.save();
        await savedOccupant.deleteOne({ _id: savedOccupant._id });
        const deletedOccupant = await Occupant.findById(savedOccupant._id);
        expect(deletedOccupant).toBeNull();
    });

    // Test for read operations
    it('reads occupant successfully', async () => {
        const validOccupant = new Occupant({ 
            firstName: 'I.M.',
            lastName: 'Tired',
            email: 'i.m-tired@mail.com',
            phoneNumber: '1234567890',
            dob: new Date('1990-01-01'),
            occupation: 'Teacher',
            emergencyContact: {
                firstName: 'Dom',
                lastName: 'Grater',
                phoneNumber: '0987654321',
                relationship: 'Best Friend',
                email: 'dom@mail.com',
            },
            reference: {
                firstName: 'Timy',
                lastName: 'Kelly',
                phoneNumber: '1122334455',
                relationship: 'Friend',
            },
            user: user._id,
         });
        const savedOccupant = await validOccupant.save();
        const foundOccupant = await Occupant.findById(savedOccupant._id);
        expect(foundOccupant.firstName).toBe(savedOccupant.firstName);
    });
});
