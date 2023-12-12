const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { 
    createPaymentRecord,
    getAllPaymentRecords,
    getPaymentRecordById,
    cancelPaymentRecord

} = require('../controllers/paymentRecordController');


// POST localhost:3000/payment-records/
router.post('/', authMiddleware, createPaymentRecord);

// GET localhost:3000/payment-records/
router.get('/', authMiddleware, getAllPaymentRecords);

// GET localhost:3000/payment-records/:id
router.get('/:id', authMiddleware, getPaymentRecordById);

// PATCH localhost:3000/payment-records/:id
router.patch('/:id', authMiddleware, cancelPaymentRecord);

module.exports = router;