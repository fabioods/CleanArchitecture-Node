import { Encrypter } from '../../protocolos/encrypter'
import { DbAddAccount } from './db-add-account'

interface MakeSut {
  encrypter: Encrypter
  dbAccount: DbAddAccount
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return 'hashedValue'
    }
  }

  return new EncrypterStub()
}

const makeSut = (): MakeSut => {
  const encrypter = makeEncrypter()
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

  it('should throw is Encrypter throws', async () => {
    const { encrypter, dbAccount } = makeSut()
    jest.spyOn(encrypter, 'encrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    }
    const savedData = dbAccount.add(accountData)

    await expect(savedData).rejects.toThrow()
  })
})
