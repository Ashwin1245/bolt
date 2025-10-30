// Response formatter for successful responses
const successResponse = (data, message) => {
  return {
    success: true,
    message,
    data
  };
};

// Response formatter for error responses
const errorResponse = (message, code) => {
  return {
    success: false,
    message,
    code
  };
};

// Async handler to eliminate try-catch boilerplate
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export { successResponse, errorResponse, asyncHandler };
