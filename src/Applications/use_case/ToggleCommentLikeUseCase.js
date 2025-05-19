const NewCommentLike = require('../../Domains/commentLikes/entities/NewCommentLike.js')

class ToggleCommentLikeUseCase {
  constructor({
    userRepository,
    threadRepository,
    commentRepository,
    commentLikeRepository
  }) {
    this._userRepository = userRepository
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._commentLikeRepository = commentLikeRepository
  }

  async execute(useCasePayload) {
    const newCommentLike = new NewCommentLike(useCasePayload)
    const { threadId, commentId, owner } = newCommentLike
    await this._userRepository.verifyUserExists(owner)
    await this._threadRepository.verifyAvailableThread(threadId)
    await this._commentRepository.verifyAvailableComment(commentId)
    const commentLikeId = await this._commentLikeRepository.getCommentLikeId(
      commentId,
      owner
    )
    if (commentLikeId) {
      await this._commentLikeRepository.deleteCommentLike(commentLikeId)
    } else {
      await this._commentLikeRepository.addCommentLike({ commentId, owner })
    }
    const commentLikeCount =
      await this._commentLikeRepository.getCommentLikeCount(commentId)
    await this._commentRepository.updateCommentLikeCount(
      commentId,
      commentLikeCount
    )
  }
}
module.exports = ToggleCommentLikeUseCase
