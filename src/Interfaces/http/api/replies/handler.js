const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase.js')
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase.js')

class ReplyHandler {
  constructor({ container }) {
    this._container = container
  }

  async postReplyHandler(request, h) {
    const { id } = request.auth.credentials
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name)
    const { threadId, commentId } = request.params
    const addedReply = await addReplyUseCase.execute({
      ...request.payload,
      threadId,
      commentId,
      owner: id
    })

    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    })
    response.code(201)
    return response
  }

  async deleteReplyHandler(request, h) {
    const { id } = request.auth.credentials
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    )
    const { threadId, commentId, replyId } = request.params
    await deleteReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      owner: id
    })

    const response = h.response({
      status: 'success'
    })

    return response
  }
}

module.exports = ReplyHandler
