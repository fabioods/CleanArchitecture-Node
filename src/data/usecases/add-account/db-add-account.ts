import { AccountModel } from '../../../domain/model/account'
import { AddAccount, AddAccountModel } from '../../../domain/useCases/addAccount'
import { Encrypter } from '../../protocolos/encrypter'

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
