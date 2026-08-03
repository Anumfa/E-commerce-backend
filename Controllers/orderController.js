import Order from '../Models/Order.js';
import Product from '../Models/productschema.js';
import nodemailer from 'nodemailer';

// Get All Orders (for admin)
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('orderItems.product', 'name images price')
            .lean();
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Order Status (for admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // If status updated to Delivered, update payment status to Completed
        if (status === 'Delivered') {
            order.paymentStatus = 'Completed';
            await order.save();
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { customerInfo, orderItems, subtotal, shippingFee, totalPrice, paymentMethod, paymentStatus } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items' });
        }

        const order = new Order({
            customerInfo,
            orderItems,
            subtotal,
            shippingFee,
            totalPrice,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            paymentStatus: paymentStatus || 'Pending'
        });

        const savedOrder = await order.save();

        // Setup Nodemailer
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.Gmailuser,
                pass: process.env.Gmailpassword
            }
        });

        // Format HTML Email
        const itemsHtml = orderItems.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name} x ${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${item.price * item.quantity}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"Your Store" <${process.env.Gmailuser}>`,
            to: customerInfo.email,
            subject: `Order Confirmation - #${savedOrder._id}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #000; text-align: center;">Thank You For Your Order!</h2>
                <p>Hi ${customerInfo.name},</p>
                <p>We've received your order and are getting it ready to be shipped. Your order number is: <strong>${savedOrder._id}</strong></p>
                
                <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                            <td style="padding: 10px; text-align: right;">Rs. ${subtotal}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; text-align: right; font-weight: bold;">Shipping Fee:</td>
                            <td style="padding: 10px; text-align: right;">Rs. ${shippingFee}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px;">Total:</td>
                            <td style="padding: 10px; text-align: right; font-size: 18px; font-weight: bold;">Rs. ${totalPrice}</td>
                        </tr>
                    </tfoot>
                </table>

                <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Shipping Information</h3>
                <p>${customerInfo.name}<br>${customerInfo.address}<br>${customerInfo.city}<br>${customerInfo.phone}</p>
                
                <p style="margin-top: 40px; font-size: 12px; color: #888; text-align: center;">If you have any questions, please reply to this email.</p>
            </div>
            `
        };

        // Send Email
        try {
            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            console.error('Error sending email:', mailError);
            // We still return success for the order creation even if email fails
        }

        res.status(201).json({
            success: true,
            data: savedOrder
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
