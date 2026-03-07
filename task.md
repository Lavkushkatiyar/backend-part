Backend Hiring Assignment – User Management & Task Tracker API
Project Overview
Build a simple backend system that allows users to register, login, and manage their own tasks. This assignment is your first evaluation task.
Technology Choice
You may use ONE of the following:

- Node.js (Express or NestJS)
- Python (FastAPI or Django REST)

Database:

- SQLite OR PostgreSQL

You MUST use:

- JWT Authentication
- ORM (Prisma / SQLAlchemy / TypeORM / Django ORM)
  Part 1 – Authentication
  Create the following APIs:
- POST /auth/register
- POST /auth/login

Requirements:

- Passwords must be hashed[]
- Login must return JWT token []
- All protected routes must require JWT 
  Part 2 – User Roles
  There are two roles:
- admin
- user

Admin can:

- View all users
- Delete users

Normal user:


- Can only view their own profile



  Part 3 – Task Management (CRUD)

  Each user can manage their own tasks.

Task fields:

- title (required)
- description (optional)
- status (pending or completed)
- created_at

Endpoints:

- POST /tasks
- GET /tasks
- PUT /tasks/{id}
- DELETE /tasks/{id}

Rules:

- Users can access ONLY their own tasks
- Admin can access ALL tasks
   Part 4 – Validation & Errors
  You must:
- Validate all inputs
- Return proper HTTP status codes
- Show clear error messages
  Part 5 – Testing
  Add:
- Minimum 3 unit tests
- Minimum 2 API tests
  Security Requirements
  Must include:
- Password hashing
- JWT authentication
- Role based access
- Environment variables for secrets
- NO credentials inside code or GitHub
  Project Structure
  Your project must contain:
- src/
- tests/
- .env.example
- README.md

README must explain:

- How to setup
- How to run server
- How to run tests
  Submission Instructions

1. Push project to GitHub
2. Share repository link
3. Include README
4. Provide sample API requests

Time limit: 48 hours
Evaluation Criteria

- Code structure
- Security implementation
- API design
- Database usage
- Tests
- Documentation
  Automatic Rejection If
- Passwords stored in plain text
- Secrets committed
- No authentication
- No README
- Copied tutorial project
  Final Note:

1.  This assignment tests real backend skills. Focus on clarity, security, and clean code.
2.  Upon completion of your project, we will evaluate it based on your understanding and the technology used, as mentioned.

                   ALL THE BEST!!
// data from jwt token 