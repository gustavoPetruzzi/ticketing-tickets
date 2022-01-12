import request from 'supertest';
import { app } from '../../app';

it('returns 404 if the ticket is not found', async () => {
  const response = await request(app)
    .get('/api/ticket/2as')
    .send()
  console.log('boldy', response.body);
  expect(response.status).toEqual(404);
});

it('returns the ticket if the ticket if found', async () => {
  const title = 'concert';
  const price = 20;
  
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
  
  expect(ticketResponse.body.title).toEqual(title);
});