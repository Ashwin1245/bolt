import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse, asyncHandler } from '../../utils/helpers.js';

// Sign up handler
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json(errorResponse('All fields required', 'MISSING_FIELDS'));
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json(errorResponse('Email already exists', 'EMAIL_EXISTS'));
  }

  // Create new user
  const user = new User({ name, email, password });
  await user.save(); // Password gets hashed via pre-save hook

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    process.env.JWT_SECRET
  );

  // Fetch saved user without password
  const userWithoutPassword = await User.findById(user._id).select('-password');

  res.status(201).json(
    successResponse(
      {
        token,
        user: userWithoutPassword
      },
      'User created successfully'
    )
  );
});

// Sign in handler
const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate both fields are provided
  if (!email || !password) {
    return res.status(400).json(errorResponse('Email and password required', 'MISSING_FIELDS'));
  }

  // Find user by email including password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json(errorResponse('Invalid credentials', 'INVALID_CREDENTIALS'));
  }

  // Compare password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json(errorResponse('Invalid credentials', 'INVALID_CREDENTIALS'));
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    process.env.JWT_SECRET
  );

  // Return user without password
  const userWithoutPassword = await User.findById(user._id).select('-password');

  res.status(200).json(
    successResponse(
      {
        token,
        user: userWithoutPassword
      },
      'Login successful'
    )
  );
});

export default { signup, signin };
