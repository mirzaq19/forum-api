import NewComment from '../../Domains/comments/entities/NewComment.js'

export default class AddCommentUseCase {
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
