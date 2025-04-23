import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase.js'

export default class UserHandler {
  constructor(container) {
    this._container = container
  }

  async postUserHandler(request, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name)
    const addedUser = await addUserUseCase.execute(request.payload)
    return h
      .response({
        status: 'success',
        data: {
          addedUser
        }
      })
      .code(201)
  }
}
