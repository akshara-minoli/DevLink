# DevLink

DevLink is a PERN stack web application that connects developers for collaboration on software projects. The platform allows users to create professional profiles, showcase technical skills, discover projects, and build teams based on shared interests and expertise.

## 🚀 Features

### User Authentication & Authorization

* Secure user registration and login
* JWT-based authentication
* Role-Based Access Control (RBAC)

### Developer Profiles

* Create and manage developer profiles
* Showcase skills, experience, and portfolio projects
* Edit personal information and social links

### Skill-Based Matching

* Match developers with suitable projects
* Search developers by skills and technologies
* Filter projects based on required skill sets

### Project Management

* Create and manage software projects
* Define project requirements and objectives
* Assign project roles and responsibilities

### Join Request System

* Send requests to join projects
* Approve or reject membership requests
* Manage project participants

### Team Collaboration

* View project members
* Manage team roles
* Track project involvement

---

## 🛠️ Technology Stack

### Frontend

* React.js
* React Router
* Axios
* CSS / Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### ORM

* Prisma ORM

### Authentication

* JSON Web Tokens (JWT)
* bcrypt.js

---

## 📂 Project Structure

```
DevLink/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── models/
│   ├── utils/
│   └── server.js
│
├── README.md
└── package.json
```

---

## 🗄️ Database Design

### Main Entities

* Users
* Skills
* Projects
* Project Members
* Join Requests
* Roles

### Relationships

* One User can own multiple Projects.
* One User can have multiple Skills.
* One Project can have multiple Members.
* Users can send multiple Join Requests.
* Project Owners can approve or reject Join Requests.

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/devlink.git
cd devlink
```

### Backend Setup

```bash
cd server
npm install
```

### Frontend Setup

```bash
cd client
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the server directory.

```env
DATABASE_URL="postgresql://username:password@localhost:5432/devlink"

JWT_SECRET=your_secret_key

PORT=5000
```

---

## 🗃️ Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run Database Migration:

```bash
npx prisma migrate dev --name init
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm start
```

Application URLs:

Frontend:

```
http://localhost:3000
```

Backend:

```
http://localhost:5000
```

---

## 🔒 Security Features

* Password hashing using bcrypt
* JWT authentication
* Protected API routes
* Role-based authorization
* Input validation and sanitization

---

## 🎯 Future Enhancements

* Real-time chat using Socket.io
* Project discussion forums
* Notifications system
* AI-based developer recommendations
* GitHub integration
* Task management dashboard

---

## 👥 Authors

Developed as part of the DevLink project.

## 📄 License

This project is licensed under the MIT License.
.
