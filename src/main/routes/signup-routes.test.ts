import supertest from 'supertest'
import { app } from '../config/app'

describe('Test signup routes', () => {
  it('should return an account on success', async () => {
    await supertest(app)
      .post('/api/signup')
      .send({ name: 'Fábio', email: 'fah_ds@Live.com', password: '123456', passwordConfirmation: '123456' })
      .expect(200)
  })
})
