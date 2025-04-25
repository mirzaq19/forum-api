import AddedThread from '../../../Domains/thread/entities/AddedThread.js'
import ThreadRepository from '../../../Domains/thread/ThreadRepository.js'
import UserRepository from '../../../Domains/users/UserRepository.js'
import AddThreadUseCase from '../AddThreadUseCase.js'

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'a thread title',
      body: 'a thread body',
      owner: 'user-123'
    }

    const expectedAddedThread = {
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner
    }

    /* creating dependency of usecase */
    const mockThreadRepository = new ThreadRepository()
    const mockUserRepository = new UserRepository()

    /* mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new AddedThread(expectedAddedThread))
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
    expect(addedThread).toStrictEqual(new AddedThread(expectedAddedThread))
    expect(mockUserRepository.verifyUserExists).toHaveBeenCalledWith(
      useCasePayload.owner
    )
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(useCasePayload)
  })
})
