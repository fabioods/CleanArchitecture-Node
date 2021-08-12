import supertest from 'supertest'
import { app } from '../config/app'

describe('Test Body Parser', () => {
  it('should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      return res.send(req.body)
    })
    await supertest(app).post('/test_body_parser').send({ name: 'Fabio' }).expect({ name: 'Fabio' })
  })
})
