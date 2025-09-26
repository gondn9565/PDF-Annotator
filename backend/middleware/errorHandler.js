// This middleware will catch errors thrown by previous middleware or route handlers.
const errorHandler = (err, req, res, next) => {
  // Determine the status code: if an error already has a statusCode, use it; otherwise, default to 500.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message, // Send the error message
    // In production, you might not want to send the stack trace for security reasons.
    // But for development, it's very useful for debugging.
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// This middleware handles requests to routes that don't exist (404 Not Found).
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the errorHandler
};

module.exports = {
  errorHandler,
  notFound,
};
