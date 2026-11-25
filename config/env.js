/**
 * Environment Configuration System
 * 
 * Centralized configuration that loads and validates environment variables
 * for different environments (local, development, production)
 */

const path = require('path');
const dotenv = require('dotenv');

// Load .env file based on NODE_ENV
const NODE_ENV = process.env.NODE_ENV || 'development';

// Load .env file for non-production environments
if (NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '..', `.env.${NODE_ENV}`);
  const defaultEnvPath = path.resolve(__dirname, '..', '.env');
  
  // Try environment-specific file first, then fall back to .env
  let result = dotenv.config({ path: envPath });
  if (result.error && NODE_ENV !== 'development') {
    // For non-dev, try default .env
    result = dotenv.config({ path: defaultEnvPath });
  } else if (result.error) {
    // For dev, try to load .env as fallback
    dotenv.config({ path: defaultEnvPath });
  }
}

/**
 * Get environment variable with validation
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not set
 * @param {boolean} required - Whether the variable is required
 * @returns {string} Environment variable value
 */
function getEnv(key, defaultValue = undefined, required = false) {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please set it in your .env file or as a system environment variable.`
    );
  }

  return value || defaultValue;
}

/**
 * Configuration object for the application
 */
const config = {
  // Environment
  env: NODE_ENV,
  isDevelopment: NODE_ENV === 'development',
  isProduction: NODE_ENV === 'production',
  isLocal: NODE_ENV === 'local',

  // Server
  port: getEnv('PORT', '3000'),
  nodeEnv: NODE_ENV,

  // Database
  mongodb: getEnv('MONGODB', '', true),

  // Authentication
  secretKey: getEnv('SECRET_KEY', '', true),
  refreshSecret: getEnv('REFRESH_SECRET', '', true),

  // API & CORS
  origin: getEnv('ORIGIN', 'http://localhost:3000'),
  graphqlAddress: getEnv('GRAPHQL_ADDRESS', 'http://localhost:3000/graphql'),

  // Frontend config
  frontendGraphqlUri: getEnv('GRAPHQL_ADDRESS', 'http://localhost:3000/graphql'),

  // Third-party services
  googleClientId: getEnv('GOOGLE_CLIENT_ID', ''),

  // Logging
  logLevel: getEnv('LOG_LEVEL', 'info'),
};

/**
 * Validate required configuration
 */
function validateConfig() {
  const requiredFields = ['mongodb', 'secretKey', 'refreshSecret'];
  const missing = requiredFields.filter(field => !config[field]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required configuration:\n${missing.map(f => `  - ${f}`).join('\n')}\n` +
      `Please check your .env file or environment variables.`
    );
  }
}

// Validate on load (except in testing)
if (NODE_ENV !== 'test') {
  try {
    validateConfig();
  } catch (error) {
    console.error('❌ Configuration Error:', error.message);
    process.exit(1);
  }
}

module.exports = config;
