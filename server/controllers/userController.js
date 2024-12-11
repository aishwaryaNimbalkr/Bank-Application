const User = require('../models/User');
const bcrypt = require('bcrypt')
const Notification = require('../models/Notification');

exports.getUserBalance = async (req, res) => {
  const userId = req.user._id;
  console.log(userId)

  try {
    const user = await User.findById(userId);
   
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
   
    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getNotifications = async (req, res) => {
  const userId = req.user._id; // Authenticated user ID from middleware

  try {
    const user = await User.findById(userId);

    // Check if notifications are turned off
    if (!user.notificationsEnabled) {
      return res.status(200).json({ 
        message: 'Notifications are disabled', 
        notificationsEnabled: false 
      });
    }

    // Fetch notifications for the user if enabled
    const notifications = await Notification.find({ user: userId }).sort({ date: -1 });

    return res.status(200).json({
      notifications, 
      notificationsEnabled: true 
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.toggleNotifications = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
   

    // Toggle the notificationsEnabled flag
    user.notificationsEnabled = !user.notificationsEnabled;



    await user.save();
    res.status(200).json({
      message: `Notifications have been ${user.notificationsEnabled ? 'enabled' : 'disabled'}`,
      notificationsEnabled: user.notificationsEnabled,
    });
  } catch (error) {
    console.error('Error toggling notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




// Change Password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    // Hash the new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change Transaction Pin
exports.changeTransactionPin = async (req, res) => {
  const { currentPin, newPin, confirmNewPin } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    // Check if current pin matches
    const isMatch = await bcrypt.compare(currentPin, user.transactionPin);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current pin is incorrect' });
    }

    // Check if new pins match
    if (newPin !== confirmNewPin) {
      return res.status(400).json({ message: 'New pins do not match' });
    }

    // Hash the new pin and update
    const hashedNewPin = await bcrypt.hash(newPin, 10);
    user.transactionPin = hashedNewPin;

    await user.save();
    res.status(200).json({ message: 'Transaction pin changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  // Simply clear the token (handled in frontend usually)
  req.user = null;
  res.json({ message: 'Logged out successfully' });
};




// Fetch all users except the current user
exports.getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Assuming `req.user.id` is set by authentication middleware
    const users = await User.find({ _id: { $ne: currentUserId } }, 'name _id'); // Exclude current user
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



