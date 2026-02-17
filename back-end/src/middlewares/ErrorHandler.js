const httpMessages = {
  400: "Bad request.",
  401: "Authentication required.",
  403: "Access denied.",
  404: "Resource not found.",
  409: "Data conflict.",
  422: "Invalid data.",
  500: "Internal server error."
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || httpMessages[statusCode];

  // Prisma Error Handling
  if (err.code && err.code.startsWith("P")) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = `data already exist : ${err.meta?.target}`;
        break;
      case "P2025":
        statusCode = 404;
        message = "data not found.";
        break;
      default:
        statusCode = 500;
        message = "database internal error.";
        break;
    }
  }

  // minimal logging for debugging
  console.error(`[Error] ${new Date().toISOString()} - ${message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

export default errorHandler;
