import fs from 'fs';
import http from 'http';

// Fetch Swagger JSON from the running server
const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api-docs-json',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const swaggerSpec = JSON.parse(data);
      
      // Save the Swagger JSON
      fs.writeFileSync('./swagger-spec.json', JSON.stringify(swaggerSpec, null, 2));
      console.log('✅ Swagger JSON exported successfully to swagger-spec.json');
      
      // Create a Postman collection from the Swagger spec
      const postmanCollection = {
        info: {
          name: "LMS API Collection",
          description: "Complete API collection for the Learning Management System",
          schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        auth: {
          type: "noauth"
        },
        variable: [
          {
            key: "baseUrl",
            value: "http://localhost:8000",
            type: "string"
          }
        ],
        item: []
      };

      // Add authentication folder
      const authFolder = {
        name: "Authentication",
        item: [
          {
            name: "Register User",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json"
                }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  user_name: "testuser",
                  user_email: "test@example.com",
                  password: "SecurePass123!",
                  confirm_password: "SecurePass123!"
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/auth/register",
                host: ["{{baseUrl}}"],
                path: ["auth", "register"]
              }
            }
          },
          {
            name: "Login User",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json"
                }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  user_email: "test@example.com",
                  password: "SecurePass123!"
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/auth/login",
                host: ["{{baseUrl}}"],
                path: ["auth", "login"]
              }
            }
          },
          {
            name: "Verify Email",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json"
                }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  user_email: "test@example.com",
                  otp: "123456"
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/auth/verify-email",
                host: ["{{baseUrl}}"],
                path: ["auth", "verify-email"]
              }
            }
          },
          {
            name: "Get User Profile",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/auth/profile",
                host: ["{{baseUrl}}"],
                path: ["auth", "profile"]
              }
            }
          }
        ]
      };

      // Add notes folder
      const notesFolder = {
        name: "Notes",
        item: [
          {
            name: "Create Note",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json"
                }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  title: "JavaScript Fundamentals",
                  content: "Variables, functions, and scope concepts",
                  noteType: "text",
                  tags: ["javascript", "programming", "fundamentals"],
                  relatedModuleId: 1
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/notes",
                host: ["{{baseUrl}}"],
                path: ["notes"]
              }
            }
          },
          {
            name: "Get Note",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/notes/1",
                host: ["{{baseUrl}}"],
                path: ["notes", "1"]
              }
            }
          },
          {
            name: "Update Note",
            request: {
              method: "PUT",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json"
                }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  title: "Advanced JavaScript Concepts",
                  content: "Closures, prototypes, and async programming",
                  tags: ["javascript", "advanced", "async"]
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/notes/1",
                host: ["{{baseUrl}}"],
                path: ["notes", "1"]
              }
            }
          },
          {
            name: "Get User Notes",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/notes/user/1?page=1&limit=10",
                host: ["{{baseUrl}}"],
                path: ["notes", "user", "1"],
                query: [
                  {
                    key: "page",
                    value: "1"
                  },
                  {
                    key: "limit",
                    value: "10"
                  }
                ]
              }
            }
          }
        ]
      };

      // Add groups folder
      const groupsFolder = {
        name: "Groups",
        item: [
          {
            name: "Create Group",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json"
                }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  name: "JavaScript Study Group",
                  description: "Weekly study sessions for JavaScript fundamentals",
                  isPrivate: false,
                  maxMembers: 20
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/groups",
                host: ["{{baseUrl}}"],
                path: ["groups"]
              }
            }
          },
          {
            name: "Join Group",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json"
                }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  joinCode: "ABC123"
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/groups/1/join",
                host: ["{{baseUrl}}"],
                path: ["groups", "1", "join"]
              }
            }
          },
          {
            name: "Get Group Members",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/groups/1/members?page=1&limit=10",
                host: ["{{baseUrl}}"],
                path: ["groups", "1", "members"],
                query: [
                  {
                    key: "page",
                    value: "1"
                  },
                  {
                    key: "limit",
                    value: "10"
                  }
                ]
              }
            }
          }
        ]
      };

      // Add friends folder
      const friendsFolder = {
        name: "Friends",
        item: [
          {
            name: "Send Friend Request",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json"
                }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  receiverId: 123,
                  message: "Hi! I'd like to connect and study together."
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/friends/request",
                host: ["{{baseUrl}}"],
                path: ["friends", "request"]
              }
            }
          },
          {
            name: "Accept Friend Request",
            request: {
              method: "POST",
              header: [],
              url: {
                raw: "{{baseUrl}}/friends/request/1/accept",
                host: ["{{baseUrl}}"],
                path: ["friends", "request", "1", "accept"]
              }
            }
          },
          {
            name: "Get Friends",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/friends?page=1&limit=10",
                host: ["{{baseUrl}}"],
                path: ["friends"],
                query: [
                  {
                    key: "page",
                    value: "1"
                  },
                  {
                    key: "limit",
                    value: "10"
                  }
                ]
              }
            }
          },
          {
            name: "Get Friend Requests",
            request: {
              method: "GET",
              header: [],
              url: {
                raw: "{{baseUrl}}/friends/requests?page=1&limit=10&type=received",
                host: ["{{baseUrl}}"],
                path: ["friends", "requests"],
                query: [
                  {
                    key: "page",
                    value: "1"
                  },
                  {
                    key: "limit",
                    value: "10"
                  },
                  {
                    key: "type",
                    value: "received"
                  }
                ]
              }
            }
          }
        ]
      };

      postmanCollection.item = [authFolder, notesFolder, groupsFolder, friendsFolder];

      // Save the Postman collection
      fs.writeFileSync('./postman-collection.json', JSON.stringify(postmanCollection, null, 2));
      console.log('✅ Postman collection exported successfully to postman-collection.json');
      
      console.log('\n📋 Next steps:');
      console.log('1. Import postman-collection.json into Postman');
      console.log('2. Set the baseUrl variable to http://localhost:8000');
      console.log('3. Test the authentication endpoints first');
      console.log('4. Use the session cookies for authenticated requests');
      
    } catch (error) {
      console.error('❌ Error parsing Swagger JSON:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error fetching Swagger JSON:', error.message);
  console.log('Make sure the server is running on http://localhost:8000');
});

req.end();
