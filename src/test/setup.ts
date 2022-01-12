import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

// declare global {
//   namespace NodeJS {
//     export interface Global {
//       signin(): string;
//     }
//   }
// }

declare global {
  var signin: () => string;
}

let mongo: any;
beforeAll( async() => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach( async() => {
  const collections = await mongoose.connection.db.collections();
  
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll( async() => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signin = () => {
  // Build a JWT payload. { id, email, iat }
  const paylaod = {
    id: 'ansoda',
    email: 'test@test.com'
  }
  // Create the JWT
  const token = jwt.sign(paylaod, process.env.JWT_KEY!);

  // Build session object { jwt: MY_JWT }
  const session = { jwt: token };
  // Turn that session into JSOn
  const sessionJSON = JSON.stringify(session);
  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // Return a string 

  return `express:sess=${base64}`;
}