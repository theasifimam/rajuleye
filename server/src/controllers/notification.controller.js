import Notification from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';

// GET /api/v1/notifications  (admin)
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = '1', limit = '20', type, unreadOnly } = req.query;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (type && ['order', 'review', 'contact'].includes(type)) filter.type = type;
  if (unreadOnly === 'true') filter.isRead = false;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort('-createdAt').skip(skip).limit(limitNum),
    Notification.countDocuments(filter),
    Notification.countDocuments({ isRead: false }),
  ]);

  res.status(200).json(
    new ApiResponse('Notifications fetched', {
      notifications,
      unreadCount,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});

// GET /api/v1/notifications/unread-count  (admin)
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ isRead: false });
  res.status(200).json(new ApiResponse('Unread count', { count }));
});

// PATCH /api/v1/notifications/:id/read  (admin)
export const markRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.status(200).json(new ApiResponse('Notification marked as read', null));
});

// PATCH /api/v1/notifications/read-all  (admin)
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  res.status(200).json(new ApiResponse('All notifications marked as read', null));
});
