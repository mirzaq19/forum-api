/* istanbul ignore file */

const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const pool = require('./database/postgres/pool.js')
const JWT = require('@hapi/jwt')

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres.js')
const BcryptPasswordHash = require('./security/BcryptPasswordHash.js')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres.js')
const JWTTokenManager = require('./security/JWTTokenManager.js')
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres.js')
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres.js')
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres.js')

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase.js')
const UserRepository = require('../Domains/users/UserRepository.js')
const PasswordHash = require('../Applications/security/PasswordHash.js')
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase.js')
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository.js')
const TokenManager = require('../Applications/security/TokenManager.js')
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase.js')
const DeleteAuthenticationUseCase = require('../Applications/use_case/DeleteAuthenticationUseCase.js')
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase.js')
const ThreadRepository = require('../Domains/threads/ThreadRepository.js')
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase.js')
const CommentRepository = require('../Domains/comments/CommentRepository.js')
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase.js')
const GetThreadDetailUseCase = require('../Applications/use_case/GetThreadDetailUseCase.js')
const ReplyRepository = require('../Domains/replies/ReplyRepository.js')
const AddReplyUseCase = require('../Applications/use_case/AddReplyUseCase.js')
const DeleteReplyUseCase = require('../Applications/use_case/DeleteReplyUseCase.js')

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
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
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
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
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
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        },
        {
          name: 'userRepository',
          internal: UserRepository.name
        }
      ]
    }
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        },
        {
          name: 'userRepository',
          internal: UserRepository.name
        }
      ]
    }
  },
  {
    key: GetThreadDetailUseCase.name,
    Class: GetThreadDetailUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        }
      ]
    }
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name
        }
      ]
    }
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        },
        {
          name: 'replyRepository',
          internal: ReplyRepository.name
        }
      ]
    }
  }
])

module.exports = container
