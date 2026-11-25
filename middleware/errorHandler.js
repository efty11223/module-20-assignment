function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || 'Something went wrong.';

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    message = 'Request body contains invalid JSON.';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID.';
  } else if (error.code === 11000) {
    statusCode = 409;
    message = `${Object.keys(error.keyPattern || {})[0] || 'Record'} already exists.`;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map((item) => item.message).join(' ');
  }

  if (statusCode >= 500) message = 'Something went wrong.';

  if (statusCode >= 500) console.error(error);
  res.status(statusCode).json({ success: false, message });
}

module.exports = errorHandler;
