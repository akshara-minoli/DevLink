# DevLink

DevLink is a MERN stack web application built to connect developers for collaboration. It helps users create profiles, showcase skills, discover relevant projects, and join teams through a streamlined request and approval flow. The platform is designed around skill-based matching, project management, and role-based access control (RBAC) so teams can collaborate with clarity and structure. 🚀

## Project Overview

DevLink makes it easier for developers to find the right people and the right projects. Users can build a profile, highlight their technical strengths, browse opportunities, and request to join projects that match their interests. Project owners can manage members, review requests, and control access based on assigned roles.

## Features

- 👤 Developer profiles with skills, experience, and project history
- 🔎 Skill-based matching to surface relevant collaboration opportunities
- 📁 Project creation and management for team leads and organizers
- ✉️ Join request system for controlled onboarding into projects
- 🔐 Role-based access control (RBAC) for secure permissions
- 🧩 Clean collaboration flow for developers, contributors, and project owners

## Tech Stack

- MongoDB for data storage
- Express.js for backend routing and API logic
- React for the client-side interface
- Tailwind CSS for utility-first styling
- Node.js for the server runtime

## Project Structure

The repository is organized as a standard MERN application:

```text
DevLink/
├── client/          # React frontend
├── server/          # Express.js API and MongoDB connection
├── README.md
└── .gitignore
```

## Installation and Setup

### Prerequisites

- Node.js 18+ recommended
- npm or yarn
- MongoDB Atlas or a local MongoDB instance

### 1. Clone the repository

```bash
git clone <repository-url>
cd DevLink
```

### 2. Install dependencies

Install dependencies for the server and client from the repo root.

```bash
npm install
```

If you want to install each workspace separately, run:

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add the required values:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/devlink
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `PORT` | Port used by the backend server |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `NODE_ENV` | Application environment, such as `development` or `production` |

## Running the Application

Start the client and server together from the repo root.

```bash
npm run dev
```

If you prefer separate terminals:

```bash
cd server
npm run dev

cd ../client
npm run dev
```

## Sample API Endpoints

These are example endpoints commonly used in a DevLink-style API:

```http
GET    /api/users/me
POST   /api/users/register
POST   /api/users/login
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
POST   /api/projects/:id/join-requests
PATCH  /api/join-requests/:id/approve
PATCH  /api/join-requests/:id/reject
```

## Future Enhancements

- Real-time notifications for project activity
- Advanced search and filtering by stack, skill, and experience
- In-app messaging between collaborators
- Analytics dashboard for project engagement and growth
- File uploads for portfolios, resumes, and project assets

## Contributing

Contributions are welcome. If you'd like to help improve DevLink:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes with clear commits.
4. Open a pull request with a concise description of the update.

Please keep changes focused and follow the existing code style and structure.

## License

This project is licensed under the MIT License. See the `LICENSE` file if one is added to the repository.
