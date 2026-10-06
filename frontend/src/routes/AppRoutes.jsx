import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import AdminLogin from "../pages/Auth/AdminLogin";
import AdminRegister from "../pages/Auth/AdminRegister";

import Dashboard from "../pages/Dashboard/Dashboard";
import QuizList from "../pages/Quiz/QuizList";
import QuizSetup from "../pages/Quiz/QuizSetup";
import QuizAttempt from "../pages/Quiz/QuizAttempt";
import QuizResult from "../pages/Quiz/QuizResult";

import Profile from "../pages/Profile/Profile";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import CreateQuiz from "../pages/Admin/CreateQuiz";
import ManageQuizzes from "../pages/Admin/ManageQuizzes";

import ProtectedRoute from "./ProtectedRoutes";
import AdminRoute from "./AdminRoutes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/setup/:id"
          element={
            <ProtectedRoute>
              <QuizSetup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <QuizAttempt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/result"
          element={
            <ProtectedRoute>
              <QuizResult />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/create-quiz"
          element={
            <AdminRoute>
              <CreateQuiz />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/quizzes"
          element={
            <AdminRoute>
              <ManageQuizzes />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="container not-found">
              <h1>404</h1>
              <p className="muted">The page you are looking for does not exist.</p>
              <p style={{ marginTop: "16px" }}><a className="link" href="/">Back to home</a></p>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;