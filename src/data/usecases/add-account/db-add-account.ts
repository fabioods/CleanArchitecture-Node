import { Encrypter, AddAccount, AddAccountModel, AccountModel } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add(account: AddAccountModel): Promise<AccountModel | null> {
    const { password } = account
    await this.encrypter.encrypt(password)
    return null
  }
}
