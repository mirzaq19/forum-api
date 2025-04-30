const ReplyRepository = require('../ReplyRepository.js')

describe('ReplyRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const replyRepository = new ReplyRepository()

    // Action and Assert
    await expect(replyRepository.getRepliesByCommentId('')).rejects.toThrow(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.addReply({})).rejects.toThrow(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.verifyReplyOwner('', '')).rejects.toThrow(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.deleteReplyById('')).rejects.toThrow(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
  })
})
