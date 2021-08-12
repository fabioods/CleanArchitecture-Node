import supertest from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongodb-helper'
import { app } from '../config/app'

describe('Test signup routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.getCollection('accounts').deleteMany({})
  })

  it('should return an account on success', async () => {
    await supertest(app)
      .post('/api/signup')
      .send({ name: 'Fábio', email: 'fah_ds@Live.com', password: '123456', passwordConfirmation: '123456' })
      .expect(200)
  })
})
