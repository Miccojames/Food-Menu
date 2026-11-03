export const errorHandler = (err, req, res, _next) => {
  // Never leak internals to clients — log the full detail server-side
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}:`, err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = 'Internal Server Error';

  // Known error shapes we can surface safely
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON body';
  } else if (err.message && statusCode < 500) {
    // Only pass through messages for 4xx errors we raised intentionally
    message = err.message;
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.code === 'P2003' || err.code === 'P2014' || err.code === '23001' ||
             String(err.message || '').includes('RESTRICT setting of foreign key')) {
    statusCode = 409;
    message = 'Resource is referenced by other records and cannot be removed';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be smaller than 5 MB' : 'Image upload failed';
  } else if (err.message && err.message.startsWith('Only image files')) {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Stack only in development
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
