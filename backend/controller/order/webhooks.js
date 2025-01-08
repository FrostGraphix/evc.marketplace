const axios = require('axios');
const addToCartModel = require('../../models/cartProduct');
const orderModel = require('../../models/orderProductModel');

const endpointSecret = process.env.PAYSTACK_ENDPOINT_WEBHOOK_SECRET_KEY;

// Function to retrieve product line items from metadata
async function getLineItems(lineItems) {
    let productItems = [];

    if (lineItems?.length) {
        for (const item of lineItems) {
            const product = item.metadata;

            const productData = {
                productId: product.productId,
                name: product.name,
                price: item.unit_amount / 100,
                quantity: item.quantity,
                image: product.images,
            };

            productItems.push(productData);
        }
    }
    return productItems;
}

const webhooks = async (request, response) => {
    const payload = request.body;
    const paystackSignature = request.headers['x-paystack-signature'];

    // Verify the webhook signature
    const isVerified = verifyPaystackWebhook(payload, paystackSignature, endpointSecret);
    if (!isVerified) {
        response.status(400).send('Webhook Error: Signature verification failed');
        return;
    }

    const event = payload.event; // Extract event type

    switch (event) {
        case 'charge.success': {
            const session = payload.data;

            // Mock session equivalent for compatibility
            const mockSession = {
                id: session.reference,
                customer_email: session.customer.email,
                metadata: session.metadata,
                amount_total: session.amount, // Amount is in kobo
                payment_intent: session.reference,
                payment_method_types: [session.channel],
                payment_status: session.status,
                shipping_options: [], // Paystack does not provide shipping details; use defaults if needed
            };

            const productDetails = await getLineItems(session.metadata.cartItems || []); // Use metadata for product details

            const orderDetails = {
                productDetails: productDetails,
                email: mockSession.customer_email,
                userId: mockSession.metadata.userId,
                paymentDetails: {
                    paymentId: mockSession.payment_intent,
                    payment_method_type: mockSession.payment_method_types,
                    payment_status: mockSession.payment_status,
                },
                shipping_options: mockSession.shipping_options.map((s) => ({
                    ...s,
                    shipping_amount: (s.shipping_amount || 0) / 100,
                })),
                totalAmount: mockSession.amount_total / 100, // Convert from kobo to NGN
            };

            const order = new orderModel(orderDetails);
            const saveOrder = await order.save(); // Save the order to MongoDB

            if (saveOrder?._id) {
                await addToCartModel.deleteMany({ userId: mockSession.metadata.userId });
            }

            break;
        }
        default:
            console.log(`Unhandled event type ${event}`);
    }

    response.status(200).send();
};

// Verify Paystack webhook signature
function verifyPaystackWebhook(payload, signature, secret) {
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(payload)).digest('hex');
    return hash === signature;
}

module.exports = webhooks;
