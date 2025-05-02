const Reply = require('../../Domains/replies/entities/Reply.js')

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload)
    const { threadId } = useCasePayload

    const thread = await this._threadRepository.getThreadById(threadId)
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    )
    const commentIds = comments.map(comment => comment.id)
    const replies = await this._replyRepository.getRepliesByCommentIds(
      commentIds
    )
    comments.forEach(comment => {
      const commentReplies = replies
        .filter(reply => reply.comment_id === comment.id)
        .map(reply => new Reply({ ...reply, date: reply.date.toISOString() }))
      comment.setReplies(commentReplies)
    })
    thread.setComments(comments)

    return thread
  }

  _verifyPayload({ threadId }) {
    if (!threadId) {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof threadId !== 'string') {
      throw new Error(
        'GET_THREAD_DETAIL_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
      )
    }
  }
}

module.exports = GetThreadDetailUseCase
