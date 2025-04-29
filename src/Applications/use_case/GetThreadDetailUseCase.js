class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload)
    const { threadId } = useCasePayload

    const thread = await this._threadRepository.getThreadById(threadId)
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    )
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
