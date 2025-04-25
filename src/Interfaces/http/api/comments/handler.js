import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js'
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js'

export default class CommentHandler {
  constructor({ container }) {
    this._container = container
  }

  async postCommentHandler(request, h) {
    const { id } = request.auth.credentials
    const { threadId } = request.params
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    )
    const addedComment = await addCommentUseCase.execute({
      ...request.payload,
      owner: id,
      threadId
    })
    return h
      .response({
        status: 'success',
        data: {
          addedComment
        }
      })
      .code(201)
  }

  async deleteCommentHandler(request, h) {
    const { id } = request.auth.credentials
    const { threadId, commentId } = request.params
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    )
    await deleteCommentUseCase.execute({
      threadId,
      commentId,
      owner: id
    })
    return h
      .response({
        status: 'success'
      })
      .code(200)
  }
}
