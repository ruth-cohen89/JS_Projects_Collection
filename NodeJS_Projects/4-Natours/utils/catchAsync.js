//A wrapper, function to catch asynchronous errors, (when promise is rejected in await)
//Asyn functions return promises,
//so When there is an error inside of an async function then the promise is rejected
//an error is thrown when the requested resource (tour) is not found
//fn refers to the passed function
//those async errors are created by mongoose, not by us (with appError class, that we can predict).
//catchAsync returns an annonymous function which is assined into the passes (called) function.
//If there's an error then it is in a returned anonymous function which will be the next function.
//this returned function has args, that means that 'next' has args now, so it jumps to the global error mw :)
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
