const mongoose = require('mongoose');
const mongodb = require('mongodb');
require('dotenv').config();
const User = require('../../src/models/userModel');
const Room = require('../../src/models/roomModel');

describe('Room Model Test', () => {
    let user;

    beforeAll(async () => {
        //connect to db
        await mongoose.connect(process.env.DB_URI);

        // create a user to be used in the test
        user = new User({ 
            firstName: 'Abby',
            lastName: 'Normal',
            email: 'abby-normal@mail.com',
            password: 'password',
        });
        await user.save();
    });

    // delete rooms and user created for test and close db connection
    afterAll(async () => {
        await Room.deleteMany({ user: user._id });
        await User.findByIdAndDelete(user._id);
        await mongoose.connection.close();
    });

    // Test for valid data
    it('create & save room successfully', async () => {
        const roomData = {
            name: 'Room 101',
            monthlyRentalPrice: 500,
            description: 'A cozy room',
            content: ['Bed', 'Table', 'Chair'],
            user: user._id,
        };
        const validRoom = new Room(roomData);
        const savedRoom = await validRoom.save();

        expect(savedRoom._id).toBeDefined();
        expect(savedRoom.name).toBe(roomData.name);
        expect(savedRoom.monthlyRentalPrice).toBe(roomData.monthlyRentalPrice);
        expect(savedRoom.description).toBe(roomData.description);
        expect(savedRoom.content).toEqual(expect.arrayContaining(roomData.content));
        expect(savedRoom.user.toString()).toBe(user._id.toString());
    });

    // Test for invalid data
    it('create room without required field should fail', async () => {
        const roomWithoutRequiredField = new Room({ name: 'Room 102' });
        let err;
        try {
            const savedRoomWithoutRequiredField = await roomWithoutRequiredField.save();
            error = savedRoomWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    // Test for duplicate room name
    it('throws error when room name already exists', async () => {
        let err;
        try {
            const room1 = new Room({ 
                name: 'Room 103',
                monthlyRentalPrice: 600,
                description: 'A large room',
                content: ['Bed', 'Table', 'Chair', 'Wardrobe'],
                user: user._id,
             });
            await room1.save();

            const room2 = new Room({ 
                name: 'Room 103',
                monthlyRentalPrice: 700,
                description: 'A small room',
                content: ['Bed', 'Table'],
                user: user._id,
             });
            await room2.save();
        }catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.mongo.MongoError);
        expect(err.code).toBe(11000);
    });

    // Test for invalid data type
    it('updates room successfully', async () => {
        const validRoom = new Room({ 
            name: 'Room 104',
            monthlyRentalPrice: 500,
            description: 'A cozy room',
            content: ['Bed', 'Table', 'Chair'],
            user: user._id,
         });
        const savedRoom = await validRoom.save();
        savedRoom.name = 'Room 105';
        const updatedRoom = await savedRoom.save();
        expect(updatedRoom.name).toBe('Room 105');
    });

    // Test for delete operations
    it('deletes room successfully', async () => {
        const validRoom = new Room({
            name: 'Room 106',
            monthlyRentalPrice: 500,
            description: 'A cozy room',
            content: ['Bed', 'Table', 'Chair'],
            user: user._id,
        });
        const savedRoom = await validRoom.save();
        await savedRoom.deleteOne({ _id: savedRoom._id });
        const deletedRoom = await Room.findById(savedRoom._id);
        expect(deletedRoom).toBeNull();
    });

    // Test for read operations
    it('reads room successfully', async () => {
        const validRoom = new Room({ 
            name: 'Room 107',
            monthlyRentalPrice: 500,
            description: 'A cozy room',
            content: ['Bed', 'Table', 'Chair'],
            user: user._id,
         });
        const savedRoom = await validRoom.save();
        const foundRoom = await Room.findById(savedRoom._id);
        expect(foundRoom.name).toBe(savedRoom.name);
    });
});
