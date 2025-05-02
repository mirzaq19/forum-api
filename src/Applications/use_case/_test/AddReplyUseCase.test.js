const NotFoundError = require('../../../Commons/exceptions/NotFoundError.js')
const CommentRepository = require('../../../Domains/comments/CommentRepository.js')
const AddedReply = require('../../../Domains/replies/entities/AddedReply.js')
const NewReply = require('../../../Domains/replies/entities/NewReply.js')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository.js')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository.js')
const UserRepository = require('../../../Domains/users/UserRepository.js')
const AddReplyUseCase = require('../AddReplyUseCase.js')

describe('AddReplyUseCase', () => {
  it('should throw NotFoundError when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'dicoding',
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

    const addReplyUseCase = new AddReplyUseCase({
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
      content: 'dicoding',
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

    const addReplyUseCase = new AddReplyUseCase({
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

  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'a reply content',
      owner: 'user-123'
    }

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    })

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
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply))

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    })

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload)

    // Assert
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.owner
      })
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
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
      new NewReply({
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        content: useCasePayload.content,
        owner: useCasePayload.owner
      })
    )
  })
})
