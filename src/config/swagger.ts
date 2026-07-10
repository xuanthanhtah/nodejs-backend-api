export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Enterprise Node.js API',
    version: '1.0.0',
    description: 'Production-ready Node.js REST API with Clean Architecture',
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
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
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          isActive: { type: 'boolean' },
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
    '/users': {
      post: {
        summary: 'Create a new user',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'firstName', 'lastName'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
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
    '/users/{id}': {
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
                required: ['firstName', 'lastName'],
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
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
  },
};
