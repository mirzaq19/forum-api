const NotFoundError = require('../../../Commons/exceptions/NotFoundError.js')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError.js')
const CommentRepository = require('../../../Domains/comments/CommentRepository.js')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository.js')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository.js')
const UserRepository = require('../../../Domains/users/UserRepository.js')
const DeleteReplyUseCase = require('../DeleteReplyUseCase.js')

describe('DeleteReplyUseCase', () => {
  it('should throw NotFoundError when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
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

    const addReplyUseCase = new DeleteReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: {},
      replyRepository: {}
    })

    // Action and Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrow(
      NotFoundError
    )
    expect(mockUserRepository.verifyUserExists).toHaveBeenCalledWith(
      useCasePayload.owner
    )
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    )
  })
  it('should throw NotFoundError when comment not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
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

    const addReplyUseCase = new DeleteReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: {}
    })

    // Action and Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrow(
      NotFoundError
    )
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

  it('should throw NotFoundError when reply not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123'
    }

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

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
    mockReplyRepository.verifyAvailableReply = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new NotFoundError('reply tidak ditemukan'))
      )

    const addReplyUseCase = new DeleteReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    // Action and Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrow(
      NotFoundError
    )
    expect(mockUserRepository.verifyUserExists).toHaveBeenCalledWith(
      useCasePayload.owner
    )
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.verifyAvailableComment).toHaveBeenCalledWith(
      useCasePayload.commentId
    )
    expect(mockReplyRepository.verifyAvailableReply).toHaveBeenCalledWith(
      useCasePayload.replyId
    )
  })

  it('should throw NotFoundError when reply owner not match', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123'
    }

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

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
    mockReplyRepository.verifyAvailableReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new AuthorizationError('reply owner not match'))
      )

    const addReplyUseCase = new DeleteReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    // Action and Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrow(
      AuthorizationError
    )
  })

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123'
    }

    /* creating dependency of usecase */
    const mockUserRepository = new UserRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    /* mocking needed function */
    mockUserRepository.verifyUserExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.verifyAvailableReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      userRepository: mockUserRepository
    })

    // Action
    await deleteReplyUseCase.execute(useCasePayload)

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
    expect(mockReplyRepository.verifyAvailableReply).toHaveBeenCalledWith(
      useCasePayload.replyId
    )
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
      useCasePayload.replyId,
      useCasePayload.owner
    )
    expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledWith(
      useCasePayload.replyId
    )
  })
})
