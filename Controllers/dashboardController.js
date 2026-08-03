import Product from '../Models/productschema.js';
import Category from '../Models/categoriesschema.js';
import Order from '../Models/Order.js';
import User from '../Models/userschema.js';

export const getDashboardStats = async (req, res) => {
    try {
        // Basic counts
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();

        // Revenue calculations
        const orders = await Order.find({ paymentStatus: 'Completed' });
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

        // Recent orders (last 10)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('orderItems.product', 'name images')
            .lean();

        // Format recent orders
        const formattedOrders = recentOrders.map(order => ({
            _id: order._id,
            product: order.orderItems[0]?.name || 'N/A',
            customer: order.customerInfo?.name || 'N/A',
            productId: order.orderItems[0]?.product?._id || order._id,
            quantity: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
            price: order.totalPrice,
            status: order.status,
            image: order.orderItems[0]?.product?.images?.[0] || ''
        }));

        // Top selling products (aggregate from orders)
        const topProductSales = await Order.aggregate([
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.product',
                    name: { $first: '$orderItems.name' },
                    totalSold: { $sum: '$orderItems.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 }
        ]);

        // Get product images for top sales
        const topProductIds = topProductSales.map(t => t._id).filter(id => id);
        const products = await Product.find({ _id: { $in: topProductIds } }).select('images name').lean();
        const productImageMap = {};
        products.forEach(p => { productImageMap[p._id.toString()] = p.images?.[0] || ''; });

        const formattedTopSales = topProductSales.map((item, idx) => ({
            id: idx + 1,
            name: item.name || 'Unknown',
            price: item.totalRevenue,
            sales: item.totalSold,
            image: productImageMap[item._id?.toString()] || ''
        }));

        // Monthly revenue for chart
        const monthlyRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'Completed' } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$totalPrice' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueChartData = monthlyRevenue.map(item => ({
            name: monthNames[item._id.month - 1],
            revenue: item.revenue,
            orders: item.orders
        }));

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalRevenue,
                    totalOrders,
                    totalUsers,
                    totalProducts,
                    totalCategories
                },
                recentOrders: formattedOrders,
                topSales: formattedTopSales,
                revenueChart: revenueChartData
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
