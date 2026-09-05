const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const http = require("http");
const jwt = require("jsonwebtoken");
const { PubSub } = require('graphql-subscriptions');
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const express = require("express");

// Load centralized configuration
const config = require('../config');

const pubSub = new PubSub();

const app = express();
app.use(cookieParser());
app.use(express.json());

// CORS Configuration
app.use(
  cors({
    origin: config.origin,
    credentials: true,
  })
);

/**
 * Initialize and start the Apollo GraphQL server
 */
const startServer = async () => {
  const resolvers = require('../graphql/resolvers');
  const typeDefs = require('../graphql/typeDefs');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Codes for errors thrown by resolver files that haven't been migrated to
    // the custom error types in graphql/errors/AppError.js yet (they still use
    // apollo-server's raw UserInputError/AuthenticationError/ForbiddenError,
    // which don't set extensions.isClientSafe). Remove once fully migrated.
    formatError: (formattedError, error) => {
      // Always log the full original error server-side for tracing.
      console.error('GraphQL Error:', error);

      const LEGACY_SAFE_CODES = new Set(['BAD_USER_INPUT', 'UNAUTHENTICATED', 'FORBIDDEN']);
      const code = formattedError.extensions?.code;
      const isSafe = formattedError.extensions?.isClientSafe === true || LEGACY_SAFE_CODES.has(code);

      if (isSafe) {
        return formattedError;
      }

      return {
        message: 'Something went wrong. Please try again.',
        extensions: { code: code || 'INTERNAL_SERVER_ERROR' },
      };
    },
  });

  await server.start();

  // GraphQL endpoint
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let user = null;
  
        const authHeader = req.headers.authorization;
        if (authHeader) {
          try {
            const token = authHeader.split(" ")[1];
            user = jwt.verify(token, config.secretKey);
          } catch (_err) {
            if (config.isDevelopment) {
              console.log('No token attached to request or token invalid');
            }
          }
        }
  
        return { req, res, pubSub, user };
      },
    })
  );

  // Serve static files (built React app)
  const distPath = path.join(__dirname, "../public");
  app.use(express.static(distPath));

  // Fallback to index.html for all other routes (SPA routing)
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  const httpServer = http.createServer(app);

  // Connect to MongoDB and start listening
  try {
    await mongoose.connect(config.mongodb, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    console.log('✅ Connected to MongoDB');

    await new Promise((resolve) => {
      httpServer.listen(config.port, () => {
        console.log(
          `🚀 Server running!\n` +
          `   GraphQL: ${config.graphqlAddress}\n` +
          `   Environment: ${config.env}\n` +
          `   Port: ${config.port}`
        );
        resolve();
      });
    });
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

// Start the server
startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
