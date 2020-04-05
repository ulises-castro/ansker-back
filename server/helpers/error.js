class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();

    this.statusCode = statusCode;
    this.messsage = message;
  }
}

const handlerError = (err, res) => {
  const { statusCode, message } = err;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  })
}

export {
  ErrorHandler,
  handlerError
}