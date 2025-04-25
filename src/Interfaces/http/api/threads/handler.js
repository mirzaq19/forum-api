import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js'

export default class ThreadHandler {
  constructor(container) {
    this._container = container
  }

  async postThreadHandler(request, h) {
    const { id } = request.auth.credentials
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      owner: id
    })
    return h
      .response({
        status: 'success',
        data: {
          addedThread
        }
      })
      .code(201)
  }
}
