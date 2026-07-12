import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';


// GET /api/v1/dashboard/metrics
export const getDashboardMetrics = asyncHandler(async (req, res) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // 1. Total Revenue (Amount Received)
    const totalRevenueAggregation = await Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);
    const totalRevenue = totalRevenueAggregation[0]?.total || 0;

    // Revenue from last 30 days
    const currentMonthRevenueAgg = await Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);
    const currentMonthRevenue = currentMonthRevenueAgg[0]?.total || 0;

    // Revenue from 30-60 days ago
    const previousMonthRevenueAgg = await Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);
    const previousMonthRevenue = previousMonthRevenueAgg[0]?.total || 0;

    // Calculate Growth %
    let growth = 0;
    if (previousMonthRevenue > 0) {
        growth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
        growth = 100; // infinite growth if prev month was 0
    }

    // 2. Active Orders
    const activeOrders = await Order.countDocuments({
        orderStatus: { $in: ['placed', 'confirmed', 'processing', 'shipped'] }
    });

    // 3. New Customers (last 30 days)
    const newCustomers = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });

    const previousMonthCustomers = await User.countDocuments({
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
    });

    let customerGrowth = 0;
    if (previousMonthCustomers > 0) {
        customerGrowth = ((newCustomers - previousMonthCustomers) / previousMonthCustomers) * 100;
    } else if (newCustomers > 0) {
        customerGrowth = 100;
    }

    // 4. Monthly Revenue for Trajectory chart (Last 12 months)
    const last12Months = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const monthlyAgg = await Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: last12Months } } },
        {
            $group: {
                _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                total: { $sum: "$finalAmount" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // The chart data needs to be 12 elements long, representing the last 12 months including current month at the end
    const monthlyRevenue = Array(12).fill(0);
    const currentMonthIndex = now.getMonth(); // 0-11

    monthlyAgg.forEach(item => {
        // Determine how many months ago this was
        const itemMonthIndex = item._id.month - 1; // 0-11
        let monthsAgo = currentMonthIndex - itemMonthIndex;
        if (monthsAgo < 0) {
            monthsAgo += 12; // It was from last year
        }

        // Position in array: 11 is current month, 0 is 11 months ago
        const arrayPosition = 11 - monthsAgo;
        if (arrayPosition >= 0 && arrayPosition < 12) {
            monthlyRevenue[arrayPosition] = item.total;
        }
    });

    // Calculate highest month to output relative percentages for the chart
    const maxMonthRev = Math.max(...monthlyRevenue, 1); // avoid div by 0
    const monthlyRevenuePercentages = monthlyRevenue.map(rev => Math.round((rev / maxMonthRev) * 100));

    // Generate month labels
    const monthNames = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    const monthLabels = [];
    for (let i = 11; i >= 0; i--) {
        let m = currentMonthIndex - i;
        if (m < 0) m += 12;
        monthLabels.push(monthNames[m]);
    }

    // 5. Recent Orders (Quick Feed)
    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email mobile');

    const formattedRecentOrders = recentOrders.map((order) => {
        // Calculate time ago
        const diffMs = now.getTime() - order.createdAt.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMins / 60);
        const diffDays = Math.round(diffHours / 24);

        let timeAgo = '';
        if (diffMins < 60) timeAgo = `${diffMins} mins ago`;
        else if (diffHours < 24) timeAgo = `${diffHours} hours ago`;
        else if (diffDays === 1) timeAgo = `1 day ago`;
        else timeAgo = `${diffDays} days ago`;

        return {
            ...order.toObject(),
            id: `#${order._id.toString().substring(order._id.toString().length - 8)}`.toUpperCase(),
            customer: order.user?.name || 'Unknown User',
            amount: order.finalAmount,
            status: order.orderStatus,
            time: timeAgo,
            rawDate: order.createdAt
        };
    });

    res.status(200).json(
        new ApiResponse('Dashboard metrics fetched', {
            totalRevenue,
            growth,
            activeOrders,
            newCustomers,
            customerGrowth,
            monthlyRevenue: monthlyRevenuePercentages,
            monthLabels,
            recentOrders: formattedRecentOrders
        })
    );
});
