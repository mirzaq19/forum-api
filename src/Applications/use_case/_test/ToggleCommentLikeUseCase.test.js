const NotFoundError = require('../../../Commons/exceptions/NotFoundError.js')
const CommentLikeRepository = require('../../../Domains/commentLikes/CommentLikeRepository.js')
const CommentRepository = require('../../../Domains/comments/CommentRepository.js')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository.js')
const UserRepository = require('../../../Domains/users/UserRepository.js')
const ToggleCommentLikeUseCase = require('../ToggleCommentLikeUseCase.js')

describe('ToggleCommentLikeUseCase', () => {
  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository()
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockUserRepository.verifyUserExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError('thread tidak ditemukan'))
      )

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: {},
      commentLikeRepository: {}
    })

    // Action and Assert
    await expect(
      toggleCommentLikeUseCase.execute(useCasePayload)
    ).rejects.toThrow(NotFoundError)
    expect(mockUserRepository.verifyUserExists).toHaveBeenCalledWith(
      useCasePayload.owner
    )
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    )
  })

  it('should throw error when comment not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    /** mocking needed function */
    mockUserRepository.verifyUserExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError('comment tidak ditemukan'))
      )

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: {}
    })

    // Action and Assert
    await expect(
      toggleCommentLikeUseCase.execute(useCasePayload)
    ).rejects.toThrow(NotFoundError)
    expect(mockUserRepository.verifyUserExists).toHaveBeenCalledWith(
      useCasePayload.owner
    )
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    )
  })

  it('should orchestrating the toggle comment like action correctly to add like', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockCommentLikeRepository = new CommentLikeRepository()

    /** mocking needed function */
    mockUserRepository.verifyUserExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.updateCommentLikeCount = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentLikeRepository.getCommentLikeId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(null))
    mockCommentLikeRepository.addCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentLikeRepository.getCommentLikeCount = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1))

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository
    })

    // Action
    await toggleCommentLikeUseCase.execute(useCasePayload)

    // Assert
    expect(mockUserRepository.verifyUserExists).toHaveBeenCalledWith(
      useCasePayload.owner
    )
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    )
    expect(mockCommentLikeRepository.getCommentLikeId).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    )
    expect(mockCommentLikeRepository.addCommentLike).toHaveBeenCalledWith({
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner
    })
    expect(mockCommentLikeRepository.getCommentLikeCount).toHaveBeenCalledWith(
      useCasePayload.commentId
    )
    expect(mockCommentRepository.updateCommentLikeCount).toHaveBeenCalledWith(
      useCasePayload.commentId,
      1
    )
  })

  it('should orchestrating the toggle comment like action correctly to remove like', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockCommentLikeRepository = new CommentLikeRepository()

    /** mocking needed function */
    mockUserRepository.verifyUserExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.updateCommentLikeCount = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentLikeRepository.getCommentLikeId = jest
      .fn()
      .mockImplementation(() => Promise.resolve('commentLike-123'))
    mockCommentLikeRepository.deleteCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentLikeRepository.getCommentLikeCount = jest
      .fn()
      .mockImplementation(() => Promise.resolve(0))

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository
    })

    // Action
    await toggleCommentLikeUseCase.execute(useCasePayload)

    // Assert
    expect(mockUserRepository.verifyUserExists).toHaveBeenCalledWith(
      useCasePayload.owner
    )
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    )
    expect(mockCommentLikeRepository.getCommentLikeId).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner
    )
    expect(mockCommentLikeRepository.deleteCommentLike).toHaveBeenCalledWith(
      'commentLike-123'
    )
    expect(mockCommentLikeRepository.getCommentLikeCount).toHaveBeenCalledWith(
      useCasePayload.commentId
    )
    expect(mockCommentRepository.updateCommentLikeCount).toHaveBeenCalledWith(
      useCasePayload.commentId,
      0
    )
  })
})
