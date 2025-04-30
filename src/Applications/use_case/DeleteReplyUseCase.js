class DeleteReplyUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    userRepository
  }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
    this._userRepository = userRepository
  }

  async execute(useCasePayload) {
    const { threadId, commentId, replyId, owner } = useCasePayload

    await this._userRepository.verifyUserExists(owner)
    await this._threadRepository.verifyAvailableThread(threadId)
    await this._commentRepository.verifyAvailableComment(commentId)
    await this._replyRepository.verifyAvailableReply(replyId)
    await this._replyRepository.verifyReplyOwner(replyId, owner)

    return this._replyRepository.deleteReplyById(replyId)
  }
}

module.exports = DeleteReplyUseCase
