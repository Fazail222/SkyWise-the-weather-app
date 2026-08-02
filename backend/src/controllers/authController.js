import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc Register User
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    return res.status(201).json(
      new ApiResponse(201, "User registered successfully", {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
        token,
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Login User
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json(
      new ApiResponse(200, "Login successful", {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin,
        },
        token,
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get User Profile
 * @route GET /api/v1/auth/profile
 * @access Private
 */
export const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json(
      new ApiResponse(200, "Profile fetched successfully", req.user)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update Profile
 * @route PATCH /api/v1/auth/profile
 * @access Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    return res.status(200).json(
      new ApiResponse(200, "Profile updated successfully", {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Change Password
 * @route PATCH /api/v1/auth/change-password
 * @access Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Current password is incorrect");
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json(
      new ApiResponse(200, "Password changed successfully")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Logout User
 * @route POST /api/v1/auth/logout
 * @access Private
 */
export const logout = async (req, res, next) => {
  try {
    return res.status(200).json(
      new ApiResponse(200, "Logged out successfully")
    );
  } catch (error) {
    next(error);
  }
};