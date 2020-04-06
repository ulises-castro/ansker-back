class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()

    this.statusCode = statusCode
    this.messsage = message
  }
}

const handlerError = (err, res) => {
  let { statusCode, message } = err

  // console.log(err)

  if (err.response) {
    statusCode = 400
    message = 'Ocurrió un error, intente más tarde'
  }

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