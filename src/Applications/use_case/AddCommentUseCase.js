const NewComment = require('../../Domains/comments/entities/NewComment.js')

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository, userRepository }) {
    this._userRepository = userRepository
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }
  async execute(useCasePayload) {
    const newComment = new NewComment(useCasePayload)
    const { threadId, owner } = newComment

    await this._userRepository.verifyUserExists(owner)
    await this._threadRepository.verifyAvailableThread(threadId)
    return this._commentRepository.addComment(newComment)
  }
}

module.exports = AddCommentUseCase
