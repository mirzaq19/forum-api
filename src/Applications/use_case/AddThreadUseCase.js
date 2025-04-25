import Newthread from '../../Domains/threads/entities/NewThread.js'

export default class AddThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository
    this._userRepository = userRepository
  }

  async execute(useCasePayload) {
    const newThread = new Newthread(useCasePayload)
    const { owner } = newThread
    await this._userRepository.verifyUserExists(owner)
    return this._threadRepository.addThread(newThread)
  }
}
