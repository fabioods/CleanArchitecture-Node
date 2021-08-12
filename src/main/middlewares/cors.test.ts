import supertest from 'supertest'
import { app } from '../config/app'

describe('Test Cors', () => {
  it('should enable cors', async () => {
    app.get('/test_cors', (req, res) => {
      return res.send()
    })
    await supertest(app).get('/test_cors').expect('access-control-allow-origin', '*')
  })
})
