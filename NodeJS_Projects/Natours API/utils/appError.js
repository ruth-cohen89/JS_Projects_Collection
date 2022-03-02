//Class for operational errors, (that we create ourselves (predict))
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    //When a new obj is created and the cons is called,
    //then that function call of creation wiil not appear in the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
