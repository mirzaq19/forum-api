import NewComment from '../../../Domains/comments/entities/NewComment.js'
import AddedComment from '../../../Domains/comments/entities/AddedComment.js'
import ThreadRepository from '../../../Domains/thread/ThreadRepository.js'
import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import UserRepository from '../../../Domains/users/UserRepository.js'
import InvariantError from '../../../Commons/exceptions/InvariantError.js'
import AddCommentUseCase from '../AddCommentUseCase.js'

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'a comment content',
      threadId: 'thread-123',
      owner: 'user-123'
    }

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    })

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
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload)

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-123',
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
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
      new NewComment({
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
        owner: useCasePayload.owner
      })
    )
  })
  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      content: 'a comment content',
      threadId: 'thread-123',
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
        Promise.reject(new InvariantError('thread tidak ditemukan'))
      )

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: {}
    })

    // Action and Assert
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrow(
      InvariantError
    )
  })
})
