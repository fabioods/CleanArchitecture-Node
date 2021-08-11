import { Encrypter, AccountModel, AddAccountRepository, AddAccountModel } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return 'hashedValue'
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const newAccount = {
        id: 'valid_id',
        ...account,
      }
      return newAccount
    }
  }

  return new AddAccountRepositoryStub()
}

interface MakeSut {
  encrypter: Encrypter
  dbAccount: DbAddAccount
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): MakeSut => {
  const encrypter = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const dbAccount = new DbAddAccount(encrypter, addAccountRepositoryStub)
  return { encrypter, dbAccount, addAccountRepositoryStub }
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

  it('should call AddAccountRepository', async () => {
    const { dbAccount, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    }
    await dbAccount.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({ name: 'valid_name', email: 'valid_email', password: 'hashedValue' })
  })
})
