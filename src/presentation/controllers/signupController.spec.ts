import SignUpController from './signupController'
import { MissingParamError } from '../error/missing-param-error'
import { InvalidParamError } from '../error/invalid-param-error'
import { EmailValidator } from '../protocols/EmailValidator'

interface SutType {
  signUpController: SignUpController
  emailValidator: EmailValidator
}

const makeSut = (): SutType => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  const emailValidator = new EmailValidatorStub()
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
