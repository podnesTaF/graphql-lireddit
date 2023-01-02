/** @format */

import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import { __prod__ } from './constants';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { User } from './entities/User';
import { Post } from './entities/Post';

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'liredditorm',
    username: 'postgres',
    password: 'podnes1972',
    logging: true,
    synchronize: true,
    entities: [Post, User],
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  app.use(
    session({
      store: new RedisStore({ client: redis as any }),
      name: 'qid',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
      },
      resave: false,
      saveUninitialized: false,
      secret: 'podnessecret',
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.get('/', (_, res) => {
    res.send('hello');
  });
  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });
};

main().catch((err) => {
  console.log(err);
});
