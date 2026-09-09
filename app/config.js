/**
 * Frontend Configuration
 * 
 * Client-side configuration for the React application
 * This file should only contain PUBLIC environment variables
 * (variables that will be visible in browser)
 * 
 * Never include secrets, API keys, or private data here
 */

// Determine GraphQL endpoint based on environment
function getGraphQLEndpoint() {
  console.log('GRAMBO: what is the env?: ', process.env.GRAPHQL_ADDRESS)
  // Each Netlify site supplies its own public API endpoint at build time.
  return process.env.GRAPHQL_ADDRESS || 'http://localhost:3000/graphql';
}

const clientConfig = {
  // Environment
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isLocal: process.env.NODE_ENV === 'local',
  isProduction: process.env.NODE_ENV === 'production',

  // GraphQL Configuration
  graphqlUri: getGraphQLEndpoint(),

  // Public API endpoints (non-sensitive info only)
  apiBase: process.env.API_BASE || 'http://localhost:3000',
};

// Log config in development
if (clientConfig.isDevelopment) {
  console.log('🔧 Frontend Config GRAMBOO:', {
    environment: clientConfig.environment,
    graphqlUri: clientConfig.graphqlUri,
  });
}

export default clientConfig;
