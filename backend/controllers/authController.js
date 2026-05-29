import User from '../models/User.js';
import generateTokens from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const { accessToken, refreshToken } = generateTokens(res, user._id);
      
      // Save refresh token to DB
      user.refreshToken = refreshToken;
      await user.save();

      res.status(201).json({
        success: true,
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(400);
      next(new Error('Invalid user data'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const { accessToken, refreshToken } = generateTokens(res, user._id);
      
      // Save refresh token to DB
      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        success: true,
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401);
      next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      res.status(401);
      return next(new Error('Not authorized, no refresh token'));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      res.status(401);
      return next(new Error('Not authorized, invalid refresh token'));
    }

    // Generate new tokens
    const tokens = generateTokens(res, user._id);
    
    // Save new refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized, token failed'));
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res, next) => {
  try {
    // Clear refresh token from DB if user is logged in
    const refreshToken = req.cookies.jwt;
    if (refreshToken) {
      try {
         const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
         const user = await User.findById(decoded.userId);
         if (user) {
            user.refreshToken = null;
            await user.save();
         }
      } catch (err) {
         // Ignore if token is already invalid
      }
    }

    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, refreshToken, logoutUser };
