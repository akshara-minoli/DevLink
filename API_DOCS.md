# DevLink Backend API Documentation

## Overview
Complete REST API backend for the DevLink developer collaboration platform.

## Base URL
`http://localhost:5000/api`

## Authentication
All protected endpoints require:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Auth Routes (`/auth`)

#### Register User
- **POST** `/auth/register`
- **Body**: `{ name, email, password, confirmPassword }`
- **Response**: `{ message, token, user: { id, name, email } }`

#### Login User
- **POST** `/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ message, token, user: { id, name, email } }`

---

### User Routes (`/users`)

#### Get Current User (Protected)
- **GET** `/users/me`
- **Response**: `{ user: { id, name, email, designation, bio, technologies, ... } }`

#### Get User by ID
- **GET** `/users/:id`
- **Response**: `{ user: { ... } }`

#### Get Current User Profile (Protected)
- **GET** `/users/profile`
- **Response**: `{ user: { ... profile data ... } }`

#### Update User Profile (Protected)
- **PUT** `/users/profile`
- **Body**: `{ name, designation, bio, github, linkedin, technologies[], workExperience }`
- **Response**: `{ message, user: { ... updated data ... } }`

---

### Project Routes (`/projects`)

#### List All Projects
- **GET** `/projects`
- **Query Params**:
  - `tags` - Comma-separated tags to filter by
  - `status` - Filter by status (active, archived, completed)
  - `search` - Search in title and description
- **Response**: `{ projects: [...] }`

#### Get Recommended Projects (Protected)
- **GET** `/projects/recommended?limit=10`
- **Returns**: Projects with skill-based matching percentage
- **Response**: `{ projects: [{ ...project, matchPercentage }] }`

#### Get User's Projects (Protected)
- **GET** `/projects/my-projects`
- **Response**: `{ owned: [...], joined: [...] }`

#### Create Project (Protected)
- **POST** `/projects`
- **Body**: `{ title, description, tags: [], repositoryUrl }`
- **Response**: `{ message, project: { ... } }`

#### Get Project by ID
- **GET** `/projects/:id`
- **Response**: `{ project: { ...with owner and members populated... } }`

#### Update Project (Protected)
- **PATCH** `/projects/:id`
- **Body**: `{ title, description, tags, repositoryUrl, status }`
- **Response**: `{ message, project: { ... } }`

#### Delete Project (Protected)
- **DELETE** `/projects/:id`
- **Response**: `{ message }`

---

### Join Request Routes (`/join-requests`)

#### Get User's Join Requests (Protected)
- **GET** `/join-requests`
- **Response**: `{ joinRequests: [...] }`

#### Get Project's Join Requests (Protected)
- **GET** `/join-requests/project/:projectId`
- **Response**: `{ joinRequests: [{ user: {...}, ... }] }`
- **Note**: Only project owner can view

#### Create Join Request (Protected)
- **POST** `/join-requests/:projectId`
- **Response**: `{ message, joinRequest: { ... } }`

#### Approve Join Request (Protected)
- **PATCH** `/join-requests/:id/approve`
- **Response**: `{ message, joinRequest, project }`

#### Reject Join Request (Protected)
- **PATCH** `/join-requests/:id/reject`
- **Response**: `{ message, joinRequest }`

---

### Activity Routes (`/activity`)

#### Get User Activity (Protected)
- **GET** `/activity?limit=20&skip=0`
- **Response**: `{ activities: [...], pagination: { total, limit, skip } }`

#### Create Activity
- **POST** `/activity`
- **Body**: `{ userId, type, projectId, description, metadata }`
- **Types**: `project_created`, `project_joined`, `profile_updated`, `project_left`, `join_request_sent`
- **Response**: `{ message, activity }`

#### Get Feed (All Activities)
- **GET** `/activity/feed/all?limit=50&skip=0`
- **Response**: `{ activities: [...], pagination: { ... } }`

---

### Notification Routes (`/notifications`)

#### Get User Notifications (Protected)
- **GET** `/notifications?limit=20&skip=0&unreadOnly=false`
- **Response**: `{ notifications: [...], unreadCount, pagination: { ... } }`

#### Create Notification
- **POST** `/notifications`
- **Body**: `{ userId, type, title, message, relatedUserId, relatedProjectId, actionUrl }`
- **Types**: `join_request`, `project_invite`, `member_joined`, `project_update`, `system`
- **Response**: `{ message, notification }`

#### Mark Notification as Read (Protected)
- **PATCH** `/notifications/:id/read`
- **Response**: `{ message, notification }`

#### Mark All as Read (Protected)
- **PATCH** `/notifications/read-all`
- **Response**: `{ message }`

#### Delete Notification (Protected)
- **DELETE** `/notifications/:id`
- **Response**: `{ message }`

---

## Data Models

### User
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  passwordHash: String (required),
  designation: String,
  workExperience: String,
  bio: String,
  github: String,
  linkedin: String,
  technologies: [String],
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  owner: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  status: String (enum: active, archived, completed),
  tags: [String],
  repositoryUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### JoinRequest
```javascript
{
  _id: ObjectId,
  project: ObjectId (ref: Project),
  user: ObjectId (ref: User),
  status: String (enum: pending, approved, rejected),
  createdAt: Date,
  updatedAt: Date
}
```

### Activity
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  type: String (project_created, project_joined, profile_updated, project_left, join_request_sent),
  project: ObjectId (ref: Project),
  description: String,
  metadata: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  type: String (join_request, project_invite, member_joined, project_update, system),
  title: String,
  message: String,
  read: Boolean,
  relatedUser: ObjectId (ref: User),
  relatedProject: ObjectId (ref: Project),
  actionUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "message": "Error description"
}
```

Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## Usage Examples

### Create a Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "AI Chat Bot",
    "description": "Build an intelligent chatbot using Node.js",
    "tags": ["Node.js", "AI", "JavaScript"],
    "repositoryUrl": "https://github.com/user/project"
  }'
```

### Join a Project
```bash
curl -X POST http://localhost:5000/api/join-requests/PROJECT_ID \
  -H "Authorization: Bearer <token>"
```

### Approve Join Request
```bash
curl -X PATCH http://localhost:5000/api/join-requests/REQUEST_ID/approve \
  -H "Authorization: Bearer <token>"
```

### Get User Notifications
```bash
curl -X GET http://localhost:5000/api/notifications?unreadOnly=true \
  -H "Authorization: Bearer <token>"
```
