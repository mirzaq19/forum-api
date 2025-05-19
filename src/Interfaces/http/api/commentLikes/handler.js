const ToggleCommentLikeUseCase = require('../../../../Applications/use_case/ToggleCommentLikeUseCase.js')

class CommentLikeHandler {
  constructor({ container }) {
    this._container = container
  }

  async putCommentLikeHandler(request, h) {
    const { id: owner } = request.auth.credentials
    const { threadId, commentId } = request.params
    const toggleCommentLikeUseCase = this._container.getInstance(
      ToggleCommentLikeUseCase.name
    )

    await toggleCommentLikeUseCase.execute({
      threadId,
      commentId,
      owner
    })

    return h
      .response({
        status: 'success'
      })
      .code(200)
  }
}

module.exports = CommentLikeHandler
