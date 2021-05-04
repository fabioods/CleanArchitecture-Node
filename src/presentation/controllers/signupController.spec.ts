import SignUpController from './signupController'
import { MissingParamError, ServerError, InvalidParamError } from '../error'
import { EmailValidator } from '../protocols'

interface SutType {
  signUpController: SignUpController
  emailValidator: EmailValidator
}

const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error()
    }
  }
  return new EmailValidatorStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutType => {
  const emailValidator = makeEmailValidator()
  const signUpController = new SignUpController(emailValidator)
  return {
    signUpController,
    emailValidator,
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
    const emailValidator = makeEmailValidatorWithError()
    const signUpController = new SignUpController(emailValidator)

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
})
