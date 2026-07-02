import Stripe from 'stripe';

export const getConfig = (req, res) => {
    res.json({ 
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        envKeys: Object.keys(process.env)
    });
};

export const createPaymentIntent = async (req, res) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const { amount } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects amount in cents/paisa depending on currency. For PKR/INR it's * 100
            currency: 'pkr',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
};
