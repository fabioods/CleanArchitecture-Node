import SignUpController from './signupController'
import { MissingParamError } from '../error/missing-param-error'

const makeSut = (): SignUpController => {
  return new SignUpController()
}

describe('SignUp Controller', () => {
  it('should be able to return 400 if no name was provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password',
        password_confirmation: 'any_password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('should be able to return 400 if no email was provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'Fábio',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should be able to return 400 if no password was provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'any@email.com',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should be able to return 400 if no passwordConfirmation was provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'any@email.com',
        password: 'any_password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should be able to return 200 if all fields was provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })
})
