import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LMS Authentication API',
      version: '1.0.0',
      description: 'Learning Management System Authentication API with comprehensive user management features',
      contact: {
        name: 'API Support',
        email: 'support@lms.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'session_id'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            isVerified: {
              type: 'boolean',
              description: 'Email verification status'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Request success status'
            },
            message: {
              type: 'string',
              description: 'Response message'
            }
          }
        },
        AuthResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          ]
        },
        RegisterRequest: {
          type: 'object',
          required: ['user_name', 'user_email', 'password'],
          properties: {
            user_name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'User name (2-50 characters)'
            },
            user_email: {
              type: 'string',
              format: 'email',
              description: 'Valid email address'
            },
            password: {
              type: 'string',
              minLength: 8,
              description: 'Password (min 8 chars, must contain lowercase, uppercase, and number)'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['user_email', 'password'],
          properties: {
            user_email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              description: 'User password'
            }
          }
        },
        VerifyEmailRequest: {
          type: 'object',
          required: ['user_email', 'otp_code'],
          properties: {
            user_email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            otp_code: {
              type: 'string',
              pattern: '^\\d{6}$',
              description: '6-digit OTP code'
            }
          }
        },
        ResendOTPRequest: {
          type: 'object',
          required: ['user_email'],
          properties: {
            user_email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            }
          }
        },
        ForgotPasswordRequest: {
          type: 'object',
          required: ['user_email'],
          properties: {
            user_email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            }
          }
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['token', 'new_password'],
          properties: {
            token: {
              type: 'string',
              description: 'Password reset token'
            },
            new_password: {
              type: 'string',
              minLength: 8,
              description: 'New password (min 8 chars, must contain lowercase, uppercase, and number)'
            }
          }
        },
        OAuthCallbackRequest: {
          type: 'object',
          required: ['code'],
          properties: {
            code: {
              type: 'string',
              description: 'Authorization code from OAuth provider'
            },
            state: {
              type: 'string',
              description: 'State parameter for CSRF protection'
            }
          }
        },
        OAuthResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                authUrl: {
                  type: 'string',
                  description: 'OAuth authorization URL'
                },
                provider: {
                  type: 'string',
                  enum: ['google', 'github', 'facebook'],
                  description: 'OAuth provider'
                },
                state: {
                  type: 'string',
                  description: 'State parameter for CSRF protection'
                }
              }
            }
          ]
        },
        Note: {
          type: 'object',
          properties: {
            noteId: {
              type: 'integer',
              description: 'Note ID'
            },
            title: {
              type: 'string',
              description: 'Note title'
            },
            content: {
              type: 'string',
              description: 'Note content'
            },
            noteType: {
              type: 'string',
              enum: ['text', 'document', 'link', 'multimedia'],
              description: 'Type of note'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Note tags'
            },
            userId: {
              type: 'integer',
              description: 'Owner user ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        CreateNoteRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Note title'
            },
            content: {
              type: 'string',
              maxLength: 10000,
              description: 'Note content'
            },
            noteType: {
              type: 'string',
              enum: ['text', 'document', 'link', 'multimedia'],
              default: 'text',
              description: 'Type of note'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Note tags'
            },
            relatedModuleId: {
              type: 'integer',
              description: 'Related learning module ID'
            }
          }
        },
        UpdateNoteRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Note title'
            },
            content: {
              type: 'string',
              maxLength: 10000,
              description: 'Note content'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Note tags'
            },
            relatedModuleId: {
              type: 'integer',
              description: 'Related learning module ID'
            }
          }
        },
        Group: {
          type: 'object',
          properties: {
            groupId: {
              type: 'integer',
              description: 'Group ID'
            },
            groupName: {
              type: 'string',
              description: 'Group name'
            },
            description: {
              type: 'string',
              description: 'Group description'
            },
            visibility: {
              type: 'string',
              enum: ['public', 'private', 'restricted'],
              description: 'Group visibility'
            },
            createdBy: {
              type: 'integer',
              description: 'Creator user ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            }
          }
        },
        CreateGroupRequest: {
          type: 'object',
          required: ['groupName'],
          properties: {
            groupName: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Group name'
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Group description'
            },
            visibility: {
              type: 'string',
              enum: ['public', 'private', 'restricted'],
              default: 'public',
              description: 'Group visibility'
            }
          }
        },
        FriendRequest: {
          type: 'object',
          properties: {
            requestId: {
              type: 'integer',
              description: 'Friend request ID'
            },
            senderId: {
              type: 'integer',
              description: 'Sender user ID'
            },
            receiverId: {
              type: 'integer',
              description: 'Receiver user ID'
            },
            status: {
              type: 'string',
              enum: ['pending', 'accepted', 'rejected', 'blocked'],
              description: 'Request status'
            },
            sentAt: {
              type: 'string',
              format: 'date-time',
              description: 'Request sent timestamp'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'array',
              items: {}
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer'
                },
                limit: {
                  type: 'integer'
                },
                total: {
                  type: 'integer'
                },
                totalPages: {
                  type: 'integer'
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
}

const specs = swaggerJSDoc(options)

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'LMS Authentication API Documentation'
  }))
  
  // Serve raw Swagger JSON
  app.get('/api-docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(specs)
  })
}

export { specs }
