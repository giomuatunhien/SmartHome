const Notification = require('../../models/notification.model');


const getNotificationById = async (req, res) => {
    try {
        const userID = req.query.userID;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;

        if (!userID) {
            return res.status(400).json({ success: false, message: 'Missing userID parameter.' });
        }

        // Build filter
        const filter = { userID };

        // Count total matching documents
        const totalRecords = await Notification.countDocuments(filter);
        //console.log(totalRecords)
        const totalPages = Math.max(Math.ceil(totalRecords / limit), 1);

        // Fetch paginated notifications, oldest first
        const notifications = await Notification.find(filter)
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return res.status(200).json({
            success: true,
            data: notifications,
            pagination: {
                page,
                limit,
                totalPages,
                totalRecords
            }
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ success: false, message: 'Server error while fetching notifications.' });
    }

};

module.exports = {
    getNotificationById
};