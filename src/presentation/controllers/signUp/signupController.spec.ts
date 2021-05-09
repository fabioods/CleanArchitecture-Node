import SignUpController from './signupController'
import { MissingParamError, ServerError, InvalidParamError } from '../../error'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './signUpProtocols'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        email: 'valid_email@mail.com',
        name: 'valid_name',
        password: 'valid_password',
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutType {
  signUpController: SignUpController
  emailValidator: EmailValidator
  addAccount: AddAccount
}

const makeSut = (): SutType => {
  const emailValidator = makeEmailValidator()
  const addAccount = makeAddAccount()
  const signUpController = new SignUpController(emailValidator, addAccount)
  return {
    signUpController,
    emailValidator,
    addAccount,
  }
}

describe('SignUp Controller', () => {
  it('should be able to return 400 if no name was provided', () => {
    const { signUpController } = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password',
        password_confirmation: 'any_password',
      },
    }
    const httpResponse = signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('should be able to return 400 if no email was provided', () => {
    const { signUpController } = makeSut()
    const httpRequest = {
      body: {
        name: 'Fábio',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should be able to return 400 if no password was provided', () => {
    const { signUpController } = makeSut()
    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'any@email.com',
      },
    }
    const httpResponse = signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should be able to return 400 if no passwordConfirmation was provided', () => {
    const { signUpController } = makeSut()
    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'any@email.com',
        password: 'any_password',
      },
    }
    const httpResponse = signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('should be able to return 400 if invalid email was provided', () => {
    const { signUpController, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValue(false)
    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'invalid_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('should be able to call EmailValidator with correct email', () => {
    const { signUpController, emailValidator } = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')
    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    signUpController.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })

  it('should be able to return 500 if EmailValidator throws', () => {
    const { signUpController, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should be able to return 400 if passwordConfirmation fails', () => {
    const { signUpController } = makeSut()
    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    }
    const httpResponse = signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('should be able to return 200 if all fields was provided', () => {
    const { signUpController } = makeSut()
    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })

  it('should call AddAccount with correct values', () => {
    const { signUpController, addAccount } = makeSut()
    const addSpy = jest.spyOn(addAccount, 'add')
    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    signUpController.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'Fábio',
      email: 'any_mail@mail.com',
      password: 'any_password',
    })
  })

  it('should be able to return 500 if AddAccount throws', () => {
    const { signUpController, addAccount } = makeSut()
    jest.spyOn(addAccount, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should be able to return 200 valid data was provided', () => {
    const { signUpController, addAccount } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        name: 'valid_name',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    }
    const httpResponse = signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      email: 'valid_email@mail.com',
      name: 'valid_name',
      password: 'valid_password',
    })
  })
})
