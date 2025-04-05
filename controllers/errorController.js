const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
  const message = `Duplicate Field value : ${
    err.keyValue['name']
  }. Please choose another one `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  console.log(err);
  const message = Object.values(err.errors)
    .map(el => el.message)
    .join('. ');

  return new AppError(message, 400);
};

const handleJwtError = err => {
  return new AppError('Invalid Token. Please login again', 401);
};

const handleJwtExpires = err => {
  return new AppError('Token Expires. Please Log in again', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err?.isOperational) {
    console.log(err.message);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('Error 💣', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);

    // console.log(err.name);
    // console.log(err.code);

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJwtError();

    if (err.name === 'TokenExpiredError') error = handleJwtExpires();

    sendErrorProd(error, res);
  }
};
