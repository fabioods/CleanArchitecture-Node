import SignUpController from './signupController'
import { MissingParamError } from '../error/missing-param-error'

describe('SignUp Controller', () => {
  it('should be able to return 400 if no name was provided', () => {
    const sut = new SignUpController()
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
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'Fábio',
        password: 'any_password',
        password_confirmation: 'any_password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  it('should be able to return 200 if all fields was provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'Fábio',
        email: 'fah_ds@Live.com',
        password: 'any_password',
        password_confirmation: 'any_password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })
})
