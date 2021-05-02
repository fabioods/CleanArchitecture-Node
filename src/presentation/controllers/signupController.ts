import { HttpRequest, HttpResponse } from '../protocols/http'

export default class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name)
      return {
        statusCode: 400,
        body: new Error('Missing Param: name'),
      }
    if (!httpRequest.body.email)
      return {
        statusCode: 400,
        body: new Error('Missing Param: email'),
      }
    return {
      statusCode: 200,
      body: {},
    }
  }
}
