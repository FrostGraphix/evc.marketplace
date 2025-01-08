const axios = require('axios'); // Import axios for API calls
const userModel = require('../../models/userModel');

const paymentController = async (request, response) => {
    try {
        const { cartItems } = request.body;

        // Retrieve the user making the payment
        const user = await userModel.findOne({ _id: request.userId });

        // Calculate the total amount in kobo (Paystack requires smallest currency unit)
        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + item.productId.sellingPrice * item.quantity;
        }, 0) * 100;

        // Prepare Paystack transaction parameters
        const params = {
            email: user.email, // Customer's email
            amount: totalAmount, // Amount in kobo
            currency: 'NGN', // Currency (default to Nigerian Naira)
            metadata: {
                userId: request.userId,
                cartItems: cartItems.map((item) => ({
                    productId: item.productId._id,
                    productName: item.productId.productName,
                    quantity: item.quantity,
                })),
            },
            callback_url: `${process.env.FRONTEND_URL}/success`, // Success URL
        };

        // Make an API call to Paystack to initialize the transaction
        const responsePaystack = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            params,
            {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Check if Paystack responded successfully
        if (responsePaystack.data.status) {
            response.status(200).json(responsePaystack.data.data); // Return Paystack session data
        } else {
            throw new Error('Failed to initialize Paystack transaction');
        }
    } catch (error) {
        // Handle errors and return response
        response.json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

module.exports = paymentController;
