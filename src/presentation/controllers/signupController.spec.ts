import SignUpController from './signupController'

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
  })
})
