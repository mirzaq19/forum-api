const NewReply = require('../../Domains/replies/entities/NewReply.js')

class AddReplyUseCase {
  constructor({
    userRepository,
    threadRepository,
    commentRepository,
    replyRepository
  }) {
    this._userRepository = userRepository
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute(useCasePayload) {
    const newReply = new NewReply(useCasePayload)
    const { threadId, commentId, owner } = newReply

    await this._userRepository.verifyUserExists(owner)
    await this._threadRepository.verifyAvailableThread(threadId)
    await this._commentRepository.verifyAvailableComment(commentId)

    return this._replyRepository.addReply(newReply)
  }
}

module.exports = AddReplyUseCase
