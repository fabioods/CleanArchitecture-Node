import { Encrypter } from '../../protocolos/encrypter'
import { DbAddAccount } from './db-add-account'

interface MakeSut {
  encrypter: Encrypter
  dbAccount: DbAddAccount
}

const makeSut = (): MakeSut => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return 'hashedValue'
    }
  }

  const encrypter = new EncrypterStub()
  const dbAccount = new DbAddAccount(encrypter)
  return { encrypter, dbAccount }
}

describe('DB Add Account', () => {
  it('should call Encrypter with correct password', async () => {
    const { encrypter, dbAccount } = makeSut()
    const encryptSpy = jest.spyOn(encrypter, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    }
    await dbAccount.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
