# Quiz App with Authentication

A full-stack quiz application with user authentication, dashboard, and quiz management.

## Features

- User registration and login
- Dashboard with quiz history and performance
- Real-time quiz taking with timer
- Score tracking and analytics
- Admin panel (placeholder for future features)
- Responsive design with modern UI

## Project Structure

```
quiz-app/
├── backend/          # Node.js/Express backend
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Authentication middleware
│   └── server.js     # Main server file
├── frontend/         # React frontend
│   ├── src/
│   │   ├── context/  # React context for auth
│   │   ├── pages/    # Page components
│   │   └── components/ # Reusable components
│   └── package.json
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/quizapp
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

4. Start MongoDB (if running locally)

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Register a new account or login
3. Access your dashboard
4. Click "Start Your Quiz" to begin
5. Configure quiz settings and start
6. Answer questions within the time limit
7. View your results and return to dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `POST /api/users/quiz-result` - Save quiz results

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `POST /api/quizzes` - Create new quiz (admin)

## Technologies Used

- **Frontend:** React, React Router, CSS3
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** Custom CSS with modern design patterns

## Future Enhancements

- Admin panel functionality
- Quiz creation interface
- Leaderboards
- Social features
- Advanced analytics