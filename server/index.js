const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const http = require("http");
const jwt = require("jsonwebtoken");
const { PubSub } = require('graphql-subscriptions');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const express = require("express");

const ENV = process.env.NODE_ENV || 'development';

if (ENV !== 'production') {
  // if we are in dev mode, put .env vars into process
  dotenv.config();
}

const PORT = process.env.PORT || 3000;
const MONGODB = process.env.MONGODB || '';
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

const resolvers = require('../graphql/resolvers');
const typeDefs = require('../graphql/typeDefs');

const pubSub = new PubSub();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let user = null;
  
        const authHeader = req.headers.authorization;
        if (authHeader) {
          try {
            const token = authHeader.split(" ")[1];
            user = jwt.verify(token, process.env.SECRET_KEY);
          } catch (_err) {
            console.log('No token attached to request or token invalid');
          }
        }
  
        return { req, res, pubSub, user };
      },
    })
  );

  const distPath = path.join(__dirname, "../public");
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  const httpServer = http.createServer(app);

  mongoose
    .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      return httpServer.listen(PORT, () => {
        console.log(`🚀 Server running at ${process.env.GRAPHQL_ADDRESS ?? 'http://localhost'}:${PORT}/graphql`);
      });
    })
    .catch((err) => {
      console.log('error connecting to the db! err: ', err);
    });
};

startServer();
