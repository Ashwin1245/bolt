import User from '../../models/User.js';
import { successResponse, errorResponse, asyncHandler } from '../../utils/helpers.js';

// Track user's projects and participations
const userProjects = {};

const userController = {
  // Get all users
  getAllUsers: asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    const response = successResponse(users, 'Users retrieved successfully');
    res.json(response);
  }),

  // Get user by ID
  getUserById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json(
        errorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    const response = successResponse(user, 'User retrieved successfully');
    res.json(response);
  }),

  // Get user projects
  getUserProjects: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json(
        errorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    const projects = userProjects[id] || { ownedProjects: [], participatingProjects: [] };
    const response = successResponse(projects, 'User projects retrieved successfully');
    res.json(response);
  }),

  // Create new user
  createUser: asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    // Validate user data
    const validation = User.validate({ name, email });
    if (!validation.isValid) {
      return res.status(400).json(
        errorResponse(validation.errors.join(', '), 'VALIDATION_ERROR')
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(
        errorResponse('Email already exists', 'EMAIL_EXISTS')
      );
    }

    // Create new user
    const user = new User({ name, email });
    await user.save();

    const response = successResponse(user, 'User created successfully');
    res.status(201).json(response);
  }),

  // Update user
  updateUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json(
        errorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    // Validate updated data
    const validation = User.validate({ name, email });
    if (!validation.isValid) {
      return res.status(400).json(
        errorResponse(validation.errors.join(', '), 'VALIDATION_ERROR')
      );
    }

    // Check if email is taken by another user
    const emailExists = await User.findOne({ email, _id: { $ne: id } });
    if (emailExists) {
      return res.status(409).json(
        errorResponse('Email already exists', 'EMAIL_EXISTS')
      );
    }

    // Update user
    user.update(req.body);
    await user.save();

    const response = successResponse(user, 'User updated successfully');
    res.json(response);
  }),

  // Get user profile
  getUserProfile: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json(
        errorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    const response = successResponse(user, 'User profile retrieved successfully');
    res.json(response);
  }),

  // Update user profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const profileData = req.body;

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json(
        errorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    // Update user profile with new data
    users[userIndex].update(profileData);

    const response = successResponse(users[userIndex], 'Profile updated successfully');
    res.json(response);
  }),

  // Delete user
  deleteUser: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json(
        errorResponse('User not found', 'USER_NOT_FOUND')
      );
    }

    // Remove user from array
    const deletedUser = users.splice(userIndex, 1)[0];

    // Remove user projects
    delete userProjects[id];

    const response = successResponse(deletedUser, 'User deleted successfully');
    res.json(response);
  })
};

export default userController;