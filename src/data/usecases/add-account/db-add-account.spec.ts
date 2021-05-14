import { Encrypter } from '../../protocolos/encrypter'
import { DbAddAccount } from './db-add-account'

describe('DB Add Account', () => {
  it('should call Encrypter with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt(value: string): Promise<string> {
        return 'hashedValue'
      }
    }

    const encryptorStub = new EncrypterStub()
    const sut = new DbAddAccount(encryptorStub)
    const encryptSpy = jest.spyOn(encryptorStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    }
    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
