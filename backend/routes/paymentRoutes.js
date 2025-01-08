const express = require('express');
const router = express.Router();
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

// Initialize Payment
router.post('/initialize', async (req, res) => {
    try {
        const { email, amount } = req.body;
        const response = await paystack.transaction.initialize({
            email,
            amount: amount * 100, // Convert to kobo
            callback_url: 'http://localhost:3000/verify'
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify Payment
router.get('/verify/:reference', async (req, res) => {
    try {
        const { reference } = req.params;
        const response = await paystack.transaction.verify(reference);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
