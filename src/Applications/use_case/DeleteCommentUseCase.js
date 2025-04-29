const DeleteComment = require('../../Domains/comments/entities/DeleteComment.js')

class DeleteCommentUseCase {
  constructor({ userRepository, threadRepository, commentRepository }) {
    this._userRepository = userRepository
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload)
    const { threadId, commentId, owner } = deleteComment

    await this._userRepository.verifyUserExists(owner)
    await this._threadRepository.verifyAvailableThread(threadId)
    await this._commentRepository.verifyAvailableComment(commentId)
    await this._commentRepository.verifyCommentOwner(commentId, owner)
    await this._commentRepository.deleteCommentById(commentId)
  }
}

module.exports = DeleteCommentUseCase
