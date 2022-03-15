import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { errorHandler, NotFoundError, currentUser } from '@ytickets/common';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';
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

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);
app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);


export { app };
