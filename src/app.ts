import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler } from '@ytickets/common';
import { NotFoundError } from '@ytickets/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // NODE_ENV is set by jest
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(errorHandler);

app.all('*', () => {
  throw new NotFoundError();
});

export { app };
