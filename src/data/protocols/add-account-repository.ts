import { AccountModel } from '../../domain/model/account'
import { AddAccountModel } from '../../domain/useCases/addAccount'

export interface AddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>
}
