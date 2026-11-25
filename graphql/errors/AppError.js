const { UserInputError, AuthenticationError, ForbiddenError } = require('apollo-server');

// Resolvers throw these (instead of apollo-server's raw error classes) to
// explicitly opt in to having their message shown to the client. formatError
// checks this flag directly rather than guessing from Apollo's built-in
// error codes, so the "is this safe to show users" decision lives here, in
// one place we control, instead of being duplicated as a list of magic
// strings inside formatError.
const markClientSafe = (error) => {
  error.extensions = { ...error.extensions, isClientSafe: true };
  return error;
};

class ValidationError extends UserInputError {
  constructor(message, properties) {
    super(message, properties);
    markClientSafe(this);
  }
}

class AuthError extends AuthenticationError {
  constructor(message) {
    super(message);
    markClientSafe(this);
  }
}

class AccessDeniedError extends ForbiddenError {
  constructor(message) {
    super(message);
    markClientSafe(this);
  }
}

module.exports = { ValidationError, AuthError, AccessDeniedError };
