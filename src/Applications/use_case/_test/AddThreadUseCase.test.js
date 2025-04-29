const AddedThread = require('../../../Domains/threads/entities/AddedThread.js')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository.js')
const UserRepository = require('../../../Domains/users/UserRepository.js')
const AddThreadUseCase = require('../AddThreadUseCase.js')

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'a thread title',
      body: 'a thread body',
      owner: 'user-123'
    }

    /* creating dependency of usecase */
    const mockThreadRepository = new ThreadRepository()
    const mockUserRepository = new UserRepository()

    /* mocking needed function */
    mockThreadRepository.addThread = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedThread({
          id: 'thread-123',
          title: useCasePayload.title,
          owner: useCasePayload.owner
        })
      )
    )
    mockUserRepository.verifyUserExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    })

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload)

    // Assert
    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: useCasePayload.owner
      })
    )
    expect(mockUserRepository.verifyUserExists).toHaveBeenCalledWith(
      useCasePayload.owner
    )
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(useCasePayload)
  })
})
