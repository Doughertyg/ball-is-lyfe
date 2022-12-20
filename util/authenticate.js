const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (context) => {
  // context = { ...headers }
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error("Authentication token must be \'Bearer [token]")
  }
  throw new Error('Authorization header must be provided');
}

/**
 * ::auth flow::
 * 
 * ui google login btn authenticates user
 *   get token and user data back
 *   - call login mutation with data
 *   - backend validates token and user
 *   - check if user exists in db. if not, direct to register
 *     - user exists in db, return data to frontend
 *   - frontend saves user data to storage and context
 * 
 *  frontend regularly checks tokens for protected routes
 *   - if invalid, delete token and clear context, redirect
 *   - if valid, continue
 * 
 *  backend validates header tokens on protected mutations/queries
 * 
 * 
 */