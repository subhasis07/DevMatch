A that enables users to connect, send/receive connection requests, and manage profiles securely. Built with Node.js, Express.js, Mongoose, and JWT.


## Features
1. User authentication and authorization using bcrypt and JWT.
2. APIs for signup, login, logout, and secure password management.
3. Connection request system: send, review, accept, or reject requests.
4. Feed with pagination to discover potential matches, excluding existing connections.
5. Middleware for role-based access and secure route handling.
6. Built-in input validation for enhanced security and error handling.


## Tech Stack
Node.js, Express.js, MongoDB, bcrypt, JWT
Validation: Custom validators and middleware
Testing Tool: Postman

## API Endpoints

## Authentication:

| Method | Endpoint                | Description                       |
|--------|-------------------------|-----------------------------------|
| POST   | `/signup`               | Register a new user               |
| POST   | `/login`                | Log in a user                     |
| POST   | `/logout`               | Log out a user                    |

## Profile:

| Method | Endpoint                               | Description                       |
|--------|----------------------------------------|-----------------------------------|
| GET    | `/profile/view`                        | View the logged-in user's profile |
| PATCH  | `/profile/edit`                        | Edit user profile                 |
| PATCH  | `/profile/edit/changepassword`         | Change user password              |

## Connections:

| Method | Endpoint                                     | Description                       |
|--------|----------------------------------------------|-----------------------------------|
| POST   | `/request/send/:status/:toUserID`            | Send a connection request         |
| POST   | `/request/send/:status/:requestID`           | Accept/Reject connection request  |

## Feed:

| Method | Endpoint                | Description                       |
|--------|-------------------------|-----------------------------------|
| GET    | `/user/feed`            | Fetch feed with pagination        |
| POST   | `/user/connections`     | List all Connections              |

## Folder Structure
```
src/
├── config/
│   └── database.js
├── middlewares/
│   └── auth.js
├── models/
│   ├── connectionRequest.js
│   └── users.js
├── routes/
│   ├── auth.js
│   ├── profile.js
│   ├── request.js
│   └── user.js
├── utils/
│   └── validators.js
└── app.js
```



