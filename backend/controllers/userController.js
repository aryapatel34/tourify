import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          bio: user.bio,
          location: user.location,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        },
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.bio = req.body.bio || user.bio;
      user.location = req.body.location || user.location;
      user.avatarUrl = req.body.avatarUrl || user.avatarUrl;

      // If user provided a password and we wanted to update it here we could
      // but the design doesn't show a password field.

      // Also update the full name if firstName or lastName changes, just to keep it in sync potentially
      if (req.body.firstName || req.body.lastName) {
         user.name = `${user.firstName} ${user.lastName}`.trim();
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phone: updatedUser.phone,
          bio: updatedUser.bio,
          location: updatedUser.location,
          avatarUrl: updatedUser.avatarUrl,
          createdAt: updatedUser.createdAt,
        },
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

export { getUserProfile, updateUserProfile };
