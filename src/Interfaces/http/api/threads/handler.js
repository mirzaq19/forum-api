import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js'
import GetThreadDetailUseCase from '../../../../Applications/use_case/GetThreadDetailUseCase.js'

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

  async getThreadHandler(request, h) {
    const { threadId } = request.params
    const getThreadDetailUseCase = this._container.getInstance(
      GetThreadDetailUseCase.name
    )
    const thread = await getThreadDetailUseCase.execute({ threadId })
    return h
      .response({
        status: 'success',
        data: {
          thread
        }
      })
      .code(200)
  }
}
