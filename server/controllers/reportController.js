const User = require('../models/User');
const Sport = require('../models/Sport');
const Coach = require('../models/Coach');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Membership = require('../models/Membership');
const Payment = require('../models/Payment');
const { generateCsv } = require('../utils/csvExporter');

// @desc    Get live dashboard analytics and metrics
// @route   GET /api/reports/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member' });
    const activeMembers = await User.countDocuments({ role: 'member', status: 'active' });
    const totalSports = await Sport.countDocuments();
    const totalCoaches = await Coach.countDocuments({ status: 'active' });
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const activeMemberships = await Membership.countDocuments({
      status: 'active',
      endDate: { $gte: new Date() }
    });

    const revenueResult = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Monthly registrations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyRegistrations = await User.aggregate([
      {
        $match: {
          role: 'member',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Format monthly registration data for Recharts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthly = monthlyRegistrations.map(item => ({
      name: `${months[item._id.month - 1]} ${item._id.year}`,
      members: item.count
    }));

    // Booking Status Distribution for PieChart
    const bookingStatusAgg = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    const bookingStatusData = bookingStatusAgg.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count
    }));

    // Sport popularity by booking count
    const sportBookingsAgg = await Booking.aggregate([
      {
        $group: {
          _id: '$sport',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    const sportIds = sportBookingsAgg.map(s => s._id);
    const sportsList = await Sport.find({ _id: { $in: sportIds } }).select('name');
    const sportNameMap = {};
    sportsList.forEach(s => { sportNameMap[s._id.toString()] = s.name; });

    const sportPopularityData = sportBookingsAgg.map(item => ({
      sport: sportNameMap[item._id.toString()] || 'Unknown',
      bookings: item.count
    }));

    // Recent 5 members
    const recentMembers = await User.find({ role: 'member' })
      .select('name email phone status createdAt avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    // Upcoming 5 events
    const nextEvents = await Event.find({ status: 'upcoming' })
      .populate('sport', 'name image')
      .sort({ eventDate: 1 })
      .limit(5);

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('member', 'name email avatar')
      .populate('sport', 'name')
      .populate('facility', 'name courtNumber')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalMembers,
        activeMembers,
        totalSports,
        totalCoaches,
        upcomingEvents,
        pendingBookings,
        confirmedBookings,
        activeMemberships,
        totalRevenue
      },
      charts: {
        monthlyRegistrations: formattedMonthly,
        bookingStatus: bookingStatusData,
        sportPopularity: sportPopularityData
      },
      recent: {
        members: recentMembers,
        events: nextEvents,
        bookings: recentBookings
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export or view Member Registration report
// @route   GET /api/reports/members
// @access  Private/Admin
exports.getMemberReport = async (req, res, next) => {
  try {
    const { startDate, endDate, exportCsv } = req.query;
    const query = { role: 'member' };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
      };
    }

    const members = await User.find(query).sort({ createdAt: -1 });

    if (exportCsv === 'true') {
      const headers = [
        { label: 'Member Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Status', key: 'status' },
        { label: 'Joined Date', key: 'joinedDate' }
      ];

      const rows = members.map(m => ({
        name: m.name,
        email: m.email,
        phone: m.phone,
        status: m.status,
        joinedDate: new Date(m.createdAt).toLocaleDateString()
      }));

      const csv = generateCsv(headers, rows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="members-report.csv"');
      return res.status(200).send(csv);
    }

    res.status(200).json({
      success: true,
      count: members.length,
      members
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export or view Booking report
// @route   GET /api/reports/bookings
// @access  Private/Admin
exports.getBookingReport = async (req, res, next) => {
  try {
    const { startDate, endDate, sport, status, exportCsv } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
      };
    }

    if (sport && sport !== 'All') {
      query.sport = sport;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('member', 'name email phone')
      .populate('sport', 'name price')
      .populate('facility', 'name courtNumber')
      .sort({ date: -1 });

    if (exportCsv === 'true') {
      const headers = [
        { label: 'Member Name', key: 'memberName' },
        { label: 'Email', key: 'email' },
        { label: 'Sport', key: 'sport' },
        { label: 'Facility', key: 'facility' },
        { label: 'Booking Date', key: 'date' },
        { label: 'Slot', key: 'slot' },
        { label: 'Status', key: 'status' }
      ];

      const rows = bookings.map(b => ({
        memberName: b.member ? b.member.name : 'Unknown',
        email: b.member ? b.member.email : 'N/A',
        sport: b.sport ? b.sport.name : 'N/A',
        facility: b.facility ? `${b.facility.name} (${b.facility.courtNumber})` : 'N/A',
        date: new Date(b.date).toLocaleDateString(),
        slot: `${b.startTime} - ${b.endTime}`,
        status: b.status
      }));

      const csv = generateCsv(headers, rows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="bookings-report.csv"');
      return res.status(200).send(csv);
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Export or view Payments / Revenue report
// @route   GET /api/reports/payments
// @access  Private/Admin
exports.getPaymentReport = async (req, res, next) => {
  try {
    const { startDate, endDate, exportCsv } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
      };
    }

    const payments = await Payment.find(query)
      .populate('member', 'name email phone')
      .sort({ date: -1 });

    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((acc, curr) => acc + curr.amount, 0);

    if (exportCsv === 'true') {
      const headers = [
        { label: 'Payment Reference', key: 'reference' },
        { label: 'Member', key: 'member' },
        { label: 'Type', key: 'type' },
        { label: 'Amount ($)', key: 'amount' },
        { label: 'Method', key: 'method' },
        { label: 'Status', key: 'status' },
        { label: 'Date', key: 'date' }
      ];

      const rows = payments.map(p => ({
        reference: p.paymentReference,
        member: p.member ? p.member.name : 'N/A',
        type: p.type,
        amount: p.amount,
        method: p.paymentMethod,
        status: p.status,
        date: new Date(p.date).toLocaleDateString()
      }));

      const csv = generateCsv(headers, rows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="payments-report.csv"');
      return res.status(200).send(csv);
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      totalRevenue,
      payments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Sport participation report
// @route   GET /api/reports/sports
// @access  Private/Admin
exports.getSportReport = async (req, res, next) => {
  try {
    const sports = await Sport.find().populate('coaches', 'name');

    const reportData = await Promise.all(
      sports.map(async sport => {
        const bookingCount = await Booking.countDocuments({ sport: sport._id });
        const eventCount = await Event.countDocuments({ sport: sport._id });
        return {
          sportId: sport._id,
          name: sport.name,
          category: sport.category,
          price: sport.price,
          capacity: sport.capacity,
          coachesCount: sport.coaches ? sport.coaches.length : 0,
          totalBookings: bookingCount,
          totalEvents: eventCount,
          status: sport.status
        };
      })
    );

    if (req.query.exportCsv === 'true') {
      const headers = [
        { label: 'Sport Name', key: 'name' },
        { label: 'Category', key: 'category' },
        { label: 'Price ($)', key: 'price' },
        { label: 'Capacity', key: 'capacity' },
        { label: 'Assigned Coaches', key: 'coachesCount' },
        { label: 'Total Bookings', key: 'totalBookings' },
        { label: 'Tournaments', key: 'totalEvents' },
        { label: 'Status', key: 'status' }
      ];

      const csv = generateCsv(headers, reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sports-report.csv"');
      return res.status(200).send(csv);
    }

    res.status(200).json({
      success: true,
      report: reportData
    });
  } catch (err) {
    next(err);
  }
};
