const mongoose = require('mongoose');
const mongodb = require('mongodb');
require('dotenv').config();
const PaymentRecord = require('../../src/models/paymentRecordModel');
const RoomAssignment = require('../../src/models/roomAssignmentModel');
const User = require('../../src/models/userModel');

describe('PaymentRecord Model Test', () => {
    let user, roomAssignment

    beforeAll(async () => {
        // connect to the db
        await mongoose.connect(process.env.DB_URI);

        // create a new user for the test
        user = new User({ 
            firstName: 'Bruce',
            lastName: 'Wayne',
            email: 'super-b@mail.com',
            password: 'password',
        });
        await user.save();

        // create new room assignment for the test
        roomAssignment = new RoomAssignment({
            room: '6576fa0668199ea5b9bce297',
            occupant: '6576fa0668199ea5b9bce296',
            user: user._id,
            startDate: new Date(),
            endDate: new Date(),
            rentInclusions: ['bills', 'internet', 'parking'],
            rentalPayment: 500,
            rentalPaymentFrequency: 'Monthly',
            securityDeposit: 1000,
        })
        await roomAssignment.save()

    });
    // delete rooms and user created for test and close db connection
    afterAll(async () => {
        await User.findByIdAndDelete(user._id);
        await RoomAssignment.findByIdAndDelete(roomAssignment._id);
        await PaymentRecord.deleteMany({ user: user._id });
        await mongoose.connection.close();
    });
    
    // Test for create new payment record with valid data
    it('create & save payment record successfully', async () => {
        const paymentRecord = {
            roomAssignment: roomAssignment._id,
            user: user._id,
            paymentType: 'Cash',
            amountPaid: 500,
            paymentPeriodStart: new Date(),
            paymentPeriodEnd: new Date(),
            nextPaymentDate: new Date()
        };
        const validPaymentRecord = new PaymentRecord(paymentRecord);
        const savedPaymentRecord = await validPaymentRecord.save();

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedPaymentRecord._id).toBeDefined();
        expect(savedPaymentRecord.paymentType).toBe(validPaymentRecord.paymentType);
        expect(savedPaymentRecord.amountPaid).toBe(validPaymentRecord.amountPaid);
        expect(savedPaymentRecord.isActive).toBe(true); 
    });


    // Test for data field validation: not extra data can be added if isn't defined in the schema
    it('insert payment record successfully, but the field not defined in schema should be undefined', async () => {
        const paymentRecordWithInvalidField = new PaymentRecord({
            roomAssignment: roomAssignment._id,
            user:user._id,
            paymentType: 'Cash',
            amountPaid: 1000,
            paymentPeriodStart: new Date(),
            paymentPeriodEnd: new Date(),
            nextPaymentDate: new Date(),
            extraField: 'Something extra'
        });
        const savedPaymentRecordWithInvalidField = await paymentRecordWithInvalidField.save();
        expect(savedPaymentRecordWithInvalidField._id).toBeDefined();
        expect(savedPaymentRecordWithInvalidField.extraField).toBeUndefined();
    });

    // Test for required data not provided
    it('create payment record without required field should failed', async () => {
        const paymentRecordWithoutRequiredField = new PaymentRecord({ paymentType: 'Cash' });
        let err;
        try {
            const savedPaymentRecordWithoutRequiredField = await paymentRecordWithoutRequiredField.save();
            error = savedPaymentRecordWithoutRequiredField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.user).toBeDefined();
    });

    //Test for data field
    it('should throw an error if fields are not the correct type', async () => {
        const paymentRecordWithInvalidField = new PaymentRecord ({
            roomAssignment: 'not an ObjectId',
            user: 'not and ObjectId',
            paymentType: new Date(),
            amountPaid: 'not a number',
            paymentPeriodStart: 'not a date',
            paymentPeriodEnd: 'not a date',
            nextPaymentDate: 'not a date',
        });
        let err;
        try {
            const savedPaymentRecordWithInvalidField = await paymentRecordWithInvalidField.save();
            error = savedPaymentRecordWithInvalidField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    // Test for view operations
    it('should read a payment record successfully', async () => {
        const paymentRecord = new PaymentRecord ({
            roomAssignment: roomAssignment._id,
            user:user._id,
            paymentType: 'Cash',
            amountPaid: 1000,
            paymentPeriodStart: new Date(),
            paymentPeriodEnd: new Date(),
            nextPaymentDate: new Date(),
        });
        await paymentRecord.save();
        const foundPaymentRecord = await PaymentRecord.findById(paymentRecord._id);

        expect(foundPaymentRecord).toBeDefined();
        expect(foundPaymentRecord.roomAssignment.toString()).toBe(roomAssignment._id.toString());
    });

    //Test for update operations (soft deletion) it udpate de status of the payment record
    it('should update a payment record successfully', async () => {
        const validPaymentRecord = new PaymentRecord({
            roomAssignment: roomAssignment._id,
            user:user._id,
            paymentType: 'Cash',
            amountPaid: 1000,
            paymentPeriodStart: new Date(),
            paymentPeriodEnd: new Date(),
            nextPaymentDate: new Date(),
        });
        await validPaymentRecord.save();
        const updatedPaymentRecord = await PaymentRecord.findByIdAndUpdate(validPaymentRecord._id, {isActive: false}, {new: true});
        expect(updatedPaymentRecord.isActive).toBe(false);
    });

    //Test for delete operations
    it('deletes payment record successfully', async() => {
        const validPaymentRecord = new PaymentRecord({
            roomAssignment: roomAssignment._id,
            user:user._id,
            paymentType: 'Cash',
            amountPaid: 1000,
            paymentPeriodStart: new Date(),
            paymentPeriodEnd: new Date(),
            nextPaymentDate: new Date(),
        });
        const savedPaymentRecord = await validPaymentRecord.save();
        await savedPaymentRecord.deleteOne({_id:savedPaymentRecord._id});
        const deletedPaymentRecord = await PaymentRecord.findById(savedPaymentRecord._id);
        expect(deletedPaymentRecord).toBeNull();
    });

});