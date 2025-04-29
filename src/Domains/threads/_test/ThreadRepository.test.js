const ThreadRepository = require('../ThreadRepository.js')

describe('ThreadRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository()

    // Action and Assert
    await expect(threadRepository.addThread('thread')).rejects.toThrow(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(
      threadRepository.verifyAvailableThread('threadId')
    ).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadRepository.getThreadById('threadId')).rejects.toThrow(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
    await expect(
      threadRepository.verifyThreadOwner('threadId', 'ownerId')
    ).rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadRepository.deleteThread('threadId')).rejects.toThrow(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    )
  })
})
