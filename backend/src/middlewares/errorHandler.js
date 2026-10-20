export const notFound = (req, res) =>
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });

export default (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;

  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'Resource already exists';
  } else if (err.name === 'SequelizeValidationError') {
    status = 400;
  }

  if (status === 500) {
    console.error(err);
    if (process.env.NODE_ENV === 'production') message = 'Internal server error';
  }
  res
    .status(status)
    .json({
      message,
      ...(err.details && { details: err.details })
    });
};