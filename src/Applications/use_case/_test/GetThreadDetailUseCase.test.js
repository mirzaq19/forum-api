import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import Comment from '../../../Domains/comments/entities/Comment.js'
import Thread from '../../../Domains/threads/entities/Thread.js'
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js'
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js'

describe('GetThreadDetailUseCase', () => {
  it('should throw error when use case payload did not contain needed property', async () => {
    // Arrange
    const useCasePayload = {}
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: {},
      commentRepository: {}
    })

    // Action and Assert
    await expect(
      getThreadDetailUseCase.execute(useCasePayload)
    ).rejects.toThrow('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
  })
  it('should throw error when use case payload did not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123
    }
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: {},
      commentRepository: {}
    })

    // Action and Assert
    await expect(
      getThreadDetailUseCase.execute(useCasePayload)
    ).rejects.toThrow(
      'GET_THREAD_DETAIL_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123'
    }

    const mockThread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-10-01T12:00:00.000Z',
      username: 'user-123'
    }
    const mockComment = {
      id: 'comment-123',
      username: 'user-123',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a comment',
      is_deleted: false
    }

    /* creating dependency of usecase */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    /* mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(new Thread(mockThread)))
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([new Comment(mockComment)]))

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
      useCasePayload.threadId
    )
    expect(threadDetail).toEqual({
      id: mockThread.id,
      title: mockThread.title,
      body: mockThread.body,
      date: mockThread.date,
      username: mockThread.username,
      comments: [
        {
          id: mockComment.id,
          username: mockComment.username,
          date: mockComment.date,
          content: mockComment.content
        }
      ]
    })
    expect(threadDetail).toBeInstanceOf(Object)
    expect(threadDetail).toHaveProperty('id')
    expect(threadDetail).toHaveProperty('title')
    expect(threadDetail).toHaveProperty('body')
    expect(threadDetail).toHaveProperty('date')
    expect(threadDetail).toHaveProperty('username')
    expect(threadDetail).toHaveProperty('comments')
    expect(threadDetail.id).toEqual(mockThread.id)
    expect(threadDetail.title).toEqual(mockThread.title)
    expect(threadDetail.body).toEqual(mockThread.body)
    expect(threadDetail.date).toEqual(mockThread.date)
    expect(threadDetail.username).toEqual(mockThread.username)
    expect(threadDetail.comments).toBeInstanceOf(Array)
    expect(threadDetail.comments[0]).toHaveProperty('id')
    expect(threadDetail.comments[0]).toHaveProperty('username')
    expect(threadDetail.comments[0]).toHaveProperty('date')
    expect(threadDetail.comments[0]).toHaveProperty('content')
    expect(threadDetail.comments[0].id).toEqual(mockComment.id)
    expect(threadDetail.comments[0].username).toEqual(mockComment.username)
    expect(threadDetail.comments[0].date).toEqual(mockComment.date)
    expect(threadDetail.comments[0].content).toEqual(mockComment.content)
  })
})
