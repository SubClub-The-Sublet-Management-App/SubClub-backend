const RoomAssignment = require('../models/roomAssignmentModel');
const PaymentRecord = require('../models/paymentRecordModel');

// // Create a new payment record
// // POST - localhost:3000/payment-records/
const createPaymentRecord = async (req, res) => {
    try {
        // Include the user field in the payment record data
        const paymentRecordData = {
            ...req.body,
            user: req.user._id,
        };

        // check if room assignment exists and it is active
        const existingRoomAssignment = await RoomAssignment.findOne({ 
            $and: [
                { _id: paymentRecordData.roomAssignment }, 
                { isActive: true }
            ] 
        });
        if (!existingRoomAssignment) {
            return res.status(400).send({ message: 'Room assignment does not exist or is not active' });
        }
        

        // check if payment amount is equal to the monthly rental price of the room
        if (paymentRecordData.amountPaid !== existingRoomAssignment.rentalPayment) {
            return res.status(400).send({ message: 'Payment amount is not equal to the monthly rental price of the room.' });
        }


        //check that payment start and end period is same length as the room assignment payment frequency
        const paymentPeriodStart = new Date(paymentRecordData.paymentPeriodStart);
        const paymentPeriodEnd = new Date(paymentRecordData.paymentPeriodEnd);
        const roomAssignmentPaymentFrequency = existingRoomAssignment.rentalPaymentFrequency;
        // convert payment frequency to days

        let paymentFrequencyInDays;
        switch (roomAssignmentPaymentFrequency) {
            case 'weekly':
                paymentFrequencyInDays = 7;
                break;
            case 'fortnightly':
                paymentFrequencyInDays = 14;
                break;
            case 'monthly':
                paymentFrequencyInDays = 30;
                break;
            default:
                paymentFrequencyInDays = 30;
        }

        // check if payment period is same length as the room assignment payment frequency
        const paymentPeriodLength = (paymentPeriodEnd - paymentPeriodStart) / (1000 * 3600 * 24);

        if (paymentPeriodLength !== paymentFrequencyInDays) {
            return res.status(400).send({ message: 'Payment period is not same length as the room assignment payment frequency.' });
        }


        // Check if a payment record for the same room assignment and payment period already exists
        const existingPaymentRecord = await PaymentRecord.findOne({ 
            roomAssignment: req.body.roomAssignment, 
            paymentPeriodStart: req.body.paymentPeriodStart, 
            paymentPeriodEnd: req.body.paymentPeriodEnd 
        });
        if (existingPaymentRecord) {
            return res.status(400).send({ message: 'A payment record for this room assignment and payment period already exists' });
        }

        // Create the new payment record
        const newPaymentRecord = await PaymentRecord.create(paymentRecordData);

        // Create a copy of the PaymentRecord object
        let paymentRecordObj = newPaymentRecord.toObject();

        // Delete the user field from the copy
        delete paymentRecordObj.user;

        // Send the response
        res.status(201).json({
            message: "Successfully created a new payment record",
            data: paymentRecordObj,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to create a new payment record",
            error: error.message,
        });
    }
};

// View all payment records
// GET localhost:3000/payment-records/
const getAllPaymentRecords = async (req, res) => {
    try {
        // Get the user ID from the request object
        const userId = req.user._id;

        // Find all payment records that belong to the user
        const allPaymentRecords = await PaymentRecord.find({ user: userId })
        .select('-user')
        res.status(200).json({
            message: "Successfully retrieved all payment records",
            data: allPaymentRecords,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve payment records",
            error: error.message,
        });
    }
};

// View a payment record by id
// GET localhost:3000/payment-records/:id
const getPaymentRecordById = async (req, res) => {
    try {
        const paymentRecord = await PaymentRecord.findOne({ _id: req.params.id, user: req.user._id })
        .select('-user')
        .populate({
            path: 'roomAssignment',
            select: '-user -startDate -endDate -isActive -isActive -isAssigned -securityDeposit -rentalPaymentFrequency -rentalPayment',
            populate: [
                { path: 'room', select: 'name content' },
                { path: 'occupant', select: 'firstName lastName' }
            ]
        });
        res.status(200).json({
            message: "Successfully retrieved payment record",
            data: paymentRecord,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve payment record",
            error: error.message,
        });
    }
}

//Cancel payment record soft delete
// PATCH localhost:3000/payment-records/:id
const cancelPaymentRecord = async (req, res) => {
    try {
        // Find the payment record by id
        const paymentRecord = await PaymentRecord.findOne({ _id: req.params.id, user: req.user._id });

        // Check if the payment record exists
        if (!paymentRecord) {
            return res.status(404).json({
                message: 'Payment record not found'
            });
        }

        // Check if the payment record is already cancelled
        if (!paymentRecord.isActive) {
            return res.status(400).json({
                message: 'Payment record is already cancelled'
            });
        }

        // Update the payment record
        paymentRecord.isActive = false;
        await paymentRecord.save();

        // Create a copy of the PaymentRecord object
        let paymentRecordObj = paymentRecord.toObject();

        // Delete the user field from the copy
        delete paymentRecordObj.user;

        // Send the response
        res.status(200).json({
            message: "Successfully cancelled payment record",
            data: paymentRecordObj,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to cancel payment record",
            error: error.message,
        });
    }
}


// Export the controller functions
module.exports = {
    createPaymentRecord,
    getAllPaymentRecords,
    getPaymentRecordById,
    cancelPaymentRecord

};