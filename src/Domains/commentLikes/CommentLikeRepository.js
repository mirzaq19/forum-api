class CommentLikeRepository {
  async getCommentLikeId(commentId, owner) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async addCommentLike(payload) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteCommentLike(commentLikeId) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getCommentLikeCount(commentId) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = CommentLikeRepository
