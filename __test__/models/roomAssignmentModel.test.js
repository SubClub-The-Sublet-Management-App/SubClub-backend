const mongoose = require('mongoose');
const mongodb = require('mongodb');
require('dotenv').config();
const RoomAssignment = require('../../src/models/roomAssignmentModel');
const Room = require('../../src/models/roomModel');
const Occupant = require('../../src/models/occupantModel');
const User = require('../../src/models/userModel');

describe('RoomAssignment Model Test', () => {
    let user, room, occupant;

    beforeAll(async () => {
        await mongoose.connect(process.env.DB_URI);

        user = new User({ 
            firstName: 'Lois',
            lastName: 'Lane',
            email: 'lois-lane@mail.com',
            password: 'password',
        });
        await user.save();

        room = new Room({
            name: 'Little house',
            monthlyRentalPrice: 500,
            description: 'A cozy room',
            content: ['Bed', 'Table', 'Chair'],
            user: user._id
        });
        await room.save();

        occupant = new Occupant({
            firstName: 'Clark',
            lastName: 'Kent',
            email: 'superman@mail.com',
            phoneNumber: '1234567890',
            dob: new Date('1991-01-01'),
            occupation: 'Family business',
            emergencyContact: {
                firstName: 'Martha',
                lastName: 'Kent',
                phoneNumber: '0987654321',
                relationship: 'mother',
                email: 'martha123@mail.com',
            },
            reference: {
                firstName: 'Perry',
                lastName: 'White',
                phoneNumber: '1122334455',
                relationship: 'boss',
                email:'perry123@mail.com'
            },
            user: user._id,
        });
        await occupant.save();
    });

    // delete rooms and user created for test and close db connection
    afterAll(async () => {
        await User.findByIdAndDelete(user._id);
        await Room.findByIdAndDelete(room._id);
        await Occupant.findByIdAndDelete(occupant._id);
        await RoomAssignment.deleteMany({ user: user._id });
        await mongoose.connection.close();
    });


    // Test for valid data
    it('create & save room assignment successfully', async () => {
        const roomAssignmentData = {
            room: room._id,
            occupant: occupant._id,
            user: user._id,
            startDate: new Date(),
            endDate: new Date(),
            rentInclusions: ['bills', 'internet', 'parking'],
            rentalPayment: 500,
            rentalPaymentFrequency: 'Monthly',
            securityDeposit: 1000,
        };
        const validRoomAssignment = new RoomAssignment(roomAssignmentData);
        const savedRoomAssignment = await validRoomAssignment.save();

        expect(savedRoomAssignment._id).toBeDefined();
        expect(savedRoomAssignment.room.toString()).toBe(roomAssignmentData.room.toString());
        expect(savedRoomAssignment.occupant.toString()).toBe(roomAssignmentData.occupant.toString());
        expect(savedRoomAssignment.user.toString()).toBe(roomAssignmentData.user.toString());
        expect(savedRoomAssignment.startDate).toEqual(roomAssignmentData.startDate);
        expect(savedRoomAssignment.endDate).toEqual(roomAssignmentData.endDate);
        expect(savedRoomAssignment.rentInclusions).toEqual(expect.arrayContaining(roomAssignmentData.rentInclusions));
        expect(savedRoomAssignment.rentalPayment).toBe(roomAssignmentData.rentalPayment);
        expect(savedRoomAssignment.rentalPaymentFrequency).toBe(roomAssignmentData.rentalPaymentFrequency);
        expect(savedRoomAssignment.securityDeposit).toBe(roomAssignmentData.securityDeposit);
    });

    // Test for required data not provided
    it('create roomAssignment without required field should fail', async () => {
        const roomAssignmentWithoutRequiredField = new RoomAssignment({ 
            room: room._id,
            occupant: occupant._id,
            user: user._id,
         });
        let err;
        try {
            const savedAssignmentWithoutRequiredField = await roomAssignmentWithoutRequiredField.save();
            error = savedAssignmentWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    // Test for field types
    it('should throw an error if fields are not the correct type', async () => {
        const roomAssignmentWithInvalidField = new RoomAssignment({
            room: 'not an ObjectId',
            occupant: 'not an ObjectId',
            user: 'not an ObjectId',
            startDate: 'not a date',
            endDate: 'not a date',
            rentInclusions: 'not an array',
            rentalPayment: 'not a number',
            rentalPaymentFrequency: 123,
            securityDeposit: 'not a number',
        });
        let err;
        try {
            const savedAssignmentWithInvalidField = await roomAssignmentWithInvalidField.save();
            error = savedAssignmentWithInvalidField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    // Test for update operation
    it('should update a room assignment successfully', async () => {
        const validRoomAssignment = new RoomAssignment({
            room: room._id,
            occupant: occupant._id,
            user: user._id,
            startDate: new Date(),
            endDate: new Date(),
            rentInclusions: ['bills', 'internet', 'parking'],
            rentalPayment: 500,
            rentalPaymentFrequency: 'Monthly',
            securityDeposit: 1000,
        });
        await validRoomAssignment.save();

        const updatedRoomAssignment = await RoomAssignment.findByIdAndUpdate(validRoomAssignment._id, { rentalPayment: 600 }, { new: true });

        expect(updatedRoomAssignment.rentalPayment).toBe(600);
    });

    // Test for read operation
    it('should read a room assignment successfully', async () => {
        const roomAssignment = new RoomAssignment({
            room: room._id,
            occupant: occupant._id,
            user: user._id,
            startDate: new Date(),
            endDate: new Date(),
            rentInclusions: ['Water', 'Electricity'],
            rentalPayment: 500,
            rentalPaymentFrequency: 'Monthly',
            securityDeposit: 1000,
        });
        await roomAssignment.save();

        const foundRoomAssignment = await RoomAssignment.findById(roomAssignment._id);

        expect(foundRoomAssignment).toBeDefined();
        expect(foundRoomAssignment.room.toString()).toBe(room._id.toString());
    });
});


    