/* istanbul ignore file */

import { createContainer } from 'instances-container'

// external agency
import { nanoid } from 'nanoid'
import bcrypt from 'bcrypt'
import pool from './database/postgres/pool.js'
import JWT from '@hapi/jwt'

// service (repository, helper, manager, etc)
import UserRepositoryPostgres from './repository/UserRepositoryPostgres.js'
import BcryptPasswordHash from './security/BcryptPasswordHash.js'
import AuthenticationRepositoryPostgres from './repository/AuthenticationRepositoryPostgres.js'
import JWTTokenManager from './security/JWTTokenManager.js'

// use case
import AddUserUseCase from '../Applications/use_case/AddUserUseCase.js'
import UserRepository from '../Domains/users/UserRepository.js'
import PasswordHash from '../Applications/security/PasswordHash.js'
import LoginUserUseCase from '../Applications/use_case/LoginUserUseCase.js'
import AuthenticationRepository from '../Domains/authentications/AuthenticationRepository.js'
import TokenManager from '../Applications/security/TokenManager.js'
import RefreshAuthenticationUseCase from '../Applications/use_case/RefreshAuthenticationUseCase.js'
import DeleteAuthenticationUseCase from '../Applications/use_case/DeleteAuthenticationUseCase.js'
import AddThreadUseCase from '../Applications/use_case/AddThreadUseCase.js'
import ThreadRepository from '../Domains/thread/ThreadRepository.js'
import ThreadRepositoryPostgres from './repository/ThreadRepositoryPostgres.js'

// creating container
const container = createContainer()

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        },
        {
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        }
      ]
    }
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  },
  {
    key: TokenManager.name,
    Class: JWTTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: JWT
        }
      ]
    }
  }
])

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        },
        {
          name: 'tokenManager',
          internal: TokenManager.name
        }
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'tokenManager',
          internal: TokenManager.name
        }
      ]
    }
  },
  {
    key: DeleteAuthenticationUseCase.name,
    Class: DeleteAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        }
      ]
    }
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'userRepository',
          internal: UserRepository.name
        }
      ]
    }
  }
])

export default container
