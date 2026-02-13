// List of default HTTP status messages used when no custom message is provided
const httpMessages = {
  400: "Bad request.",
  401: "Authentication required.",
  403: "Access denied.",
  404: "Resource not found.",
  409: "Data conflict.",
  422: "Invalid data.",
  500: "Internal server error."
};

// Global error-handling middleware for Express
const errorHandler = (err, req, res, next) => {
  // Use the provided statusCode or default to 500
  let statusCode = err.statusCode || 500;
  // Use the explicit error message or fallback to the default HTTP message
  let message = err.message || httpMessages[statusCode];

  // Prisma-specific error handling
  if (err.code && err.code.startsWith("P")) {
    switch (err.code) {
      case "P2002":
        // Unique constraint violation
        statusCode = 409;
        message = `data already exist : ${err.meta?.target}`;
        break;
      case "P2025":
        // Record not found
        statusCode = 404;
        message = "data not found.";
        break;
      default:
        // Any other Prisma error
        statusCode = 500;
        message = "database internal error.";
        break;
    }
  }

  // Minimal logging for debugging
  console.error(`[Error] ${new Date().toISOString()} - ${message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  // Send JSON error response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    // Expose stack trace only in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

export default errorHandler;
