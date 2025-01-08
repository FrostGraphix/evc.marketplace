const Paystack = require('paystack')

const paystack = Paystack(process.env.REACT_APP_PAYSTACK_SECRET_KEY)

module.exports = paystack