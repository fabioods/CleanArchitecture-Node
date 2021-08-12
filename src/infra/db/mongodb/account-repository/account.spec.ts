import { MongoHelper } from '../helpers/mongodb-helper'
import { AccountMongoRepository } from './account'

interface MakeSUT {
  accountMongoRepository: AccountMongoRepository
}

const makeSut = (): MakeSUT => {
  const accountMongoRepository = new AccountMongoRepository()

  return {
    accountMongoRepository,
  }
}

describe('Account MongoDB Repository', () => {
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
    const { accountMongoRepository } = makeSut()
    const account = await accountMongoRepository.add({
      name: 'any_name',
      password: 'any_password',
      email: 'any_email@test.com',
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@test.com')
  })
})
