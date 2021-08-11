import { hash } from 'bcrypt'
import { Encrypter } from '../../data/protocols/encrypter'

export class BcryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {}

  async encrypt(value: string): Promise<string> {
    const encryptedValue = await hash(value, this.salt)
    return encryptedValue
  }
}
