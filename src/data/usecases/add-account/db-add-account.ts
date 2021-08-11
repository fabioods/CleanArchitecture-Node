import { Encrypter, AddAccount, AddAccountModel, AccountModel, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  private readonly addAccountRepository: AddAccountRepository

  constructor(encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add(accountData: AddAccountModel): Promise<AccountModel | null> {
    const { password } = accountData
    const hashedPassword = await this.encrypter.encrypt(password)
    await this.addAccountRepository.add(Object.assign(accountData, { password: hashedPassword }))
    return null
  }
}
