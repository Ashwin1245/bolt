import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    default: 'user'
  },
  avatar: {
    type: String
  },
  bio: {
    type: String
  },
  skills: {
    type: [String],
    default: []
  },
  experience: {
    type: String
  },
  location: {
    type: String
  },
  provider: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

// Static method to validate user data
userSchema.statics.validate = function({ name, email }) {
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Static method to create user
userSchema.statics.create = function({ name, email, password }) {
  return new this({
    name,
    email,
    password,
    role: 'user'
  });
};

// Instance method to update user
userSchema.methods.update = function(data) {
  Object.keys(data).forEach(key => {
    if (key !== 'password' && this[key] !== undefined) {
      this[key] = data[key];
    }
  });
  this.updatedAt = Date.now();
};

const User = mongoose.model('User', userSchema);

export default User;
