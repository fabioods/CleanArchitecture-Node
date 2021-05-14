import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  },
}))

describe('Email validator Adapter', () => {
  it('should be able to return false if validator returns false', () => {
    const emailValidator = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = emailValidator.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  it('should be able to return true if validator returns true', () => {
    const emailValidator = new EmailValidatorAdapter()
    const isValid = emailValidator.isValid('invalid_email@mail.com')
    expect(isValid).toBe(true)
  })

  it('should call validator with correct email', () => {
    const emailValidator = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    emailValidator.isValid('any_email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
