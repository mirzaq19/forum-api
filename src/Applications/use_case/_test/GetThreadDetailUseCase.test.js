const CommentRepository = require('../../../Domains/comments/CommentRepository.js')
const Comment = require('../../../Domains/comments/entities/Comment.js')
const Reply = require('../../../Domains/replies/entities/Reply.js')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository.js')
const Thread = require('../../../Domains/threads/entities/Thread.js')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository.js')
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase.js')

describe('GetThreadDetailUseCase', () => {
  it('should throw error when use case payload did not contain needed property', async () => {
    // Arrange
    const useCasePayload = {}
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {}
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
      commentRepository: {},
      replyRepository: {}
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
      username: 'dicoding'
    }
    const mockComment = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2023-10-01T12:00:00.000Z',
      content: 'This is a comment',
      is_deleted: false
    }

    const mockReply = {
      id: 'reply-123',
      comment_id: 'comment-123',
      content: 'This is a reply',
      date: new Date('2023-10-01T12:00:00.000Z'),
      username: 'dicoding',
      is_deleted: false
    }

    const expectedComment = new Comment(mockComment)
    expectedComment.setReplies([
      new Reply({
        ...mockReply,
        date: mockReply.date.toISOString()
      })
    ])
    const expectedThreadDetail = new Thread(mockThread)
    expectedThreadDetail.setComments([expectedComment])

    /* creating dependency of usecase */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()

    /* mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(new Thread(mockThread)))
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([new Comment(mockComment)]))
    mockReplyRepository.getRepliesByCommentIds = jest
      .fn()
      .mockImplementation(() => Promise.resolve([mockReply]))

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
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
    expect(threadDetail).toStrictEqual(expectedThreadDetail)
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
    expect(threadDetail.comments[0].replies).toBeInstanceOf(Array)
    expect(threadDetail.comments[0].replies[0]).toHaveProperty('id')
    expect(threadDetail.comments[0].replies[0]).toHaveProperty('content')
    expect(threadDetail.comments[0].replies[0]).toHaveProperty('date')
    expect(threadDetail.comments[0].replies[0]).toHaveProperty('username')
  })
})
