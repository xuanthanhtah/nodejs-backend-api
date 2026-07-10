export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Enterprise Node.js API',
    version: '1.0.0',
    description: 'Production-ready Node.js REST API with Clean Architecture',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          displayName: { type: 'string' },
          role: { type: 'string' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Document: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          code: { type: 'string' },
          title: { type: 'string' },
          category: { type: 'string' },
          status: { type: 'string' },
          createdBy: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/v1/users': {
      post: {
        summary: 'Create a new user',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'displayName'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  displayName: { type: 'string' },
                  role: { type: 'string' }
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User created successfully' },
          '400': { description: 'Validation error' },
          '409': { description: 'Email already in use' },
        },
      },
    },
    '/v1/users/{id}': {
      get: {
        summary: 'Get user by ID',
        tags: ['Users'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'Success' },
          '404': { description: 'User not found' },
        },
      },
      put: {
        summary: 'Update user',
        tags: ['Users'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['displayName'],
                properties: {
                  displayName: { type: 'string' },
                  role: { type: 'string' }
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Success' },
          '404': { description: 'User not found' },
        },
      },
      delete: {
        summary: 'Delete user',
        tags: ['Users'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '204': { description: 'User deleted successfully' },
          '404': { description: 'User not found' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login to the application',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Successful login' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/auth/me': {
      get: {
        summary: 'Get current user info',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Current user data' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/auth/logout': {
      post: {
        summary: 'Logout user',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Logout successful' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/documents': {
      get: {
        summary: 'Get list of documents',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'pageSize', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'List of documents' }
        }
      },
      post: {
        summary: 'Create a document',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['code', 'title', 'category', 'status'],
                properties: {
                  code: { type: 'string' },
                  title: { type: 'string' },
                  category: { type: 'string' },
                  status: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Document created successfully' }
        }
      }
    },
    '/documents/batch': {
      post: {
        summary: 'Batch insert documents',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['code', 'title', 'category', 'status'],
                  properties: {
                    code: { type: 'string' },
                    title: { type: 'string' },
                    category: { type: 'string' },
                    status: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Documents inserted successfully' }
        }
      }
    },
    '/documents/{id}': {
      put: {
        summary: 'Update a document',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  title: { type: 'string' },
                  category: { type: 'string' },
                  status: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Document updated successfully' }
        }
      },
      delete: {
        summary: 'Delete a document',
        tags: ['Documents'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '204': { description: 'Document deleted successfully' }
        }
      }
    }
  }
};
