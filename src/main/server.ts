import { MongoHelper } from '../infra/db/mongodb/helpers/mongodb-helper'
import env from './config/env'

MongoHelper.connect(env.mongoURL)
  .then(async () => {
    const { app } = await import('./config/app')
    app.listen(env.port, () => {
      console.log('App running on port 5000')
    })
  })
  .catch(console.error)
