import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: 'desc' })
      .limit(20);

    if (!notifications.length) return res.send('No notifications found');

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (notification.user !== req.userId)
      return res.status(401).json({
        error: "You are permitted to update only your's notifications",
      });

    return res.json(notification);
  }
}

export default new NotificationController();
