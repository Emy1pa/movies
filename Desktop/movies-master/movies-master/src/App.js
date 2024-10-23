import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./navbar/Navbar";
import Register from "./forms/Register";
import Login from "./forms/Login";
import ForgotPassword from "./password/ForgotPassword";
import ResetPassword from "./password/ResetPassword";
import CheckEmail from "./password/CheckEmail";
import Success from "./password/Success";
import SideBar from "./dashboard/SideBar";
import Page from "./Page";
import Movies from "./movies/Movies";
import MovieDetails from "./movies/MovieDetails";
import AvailableScreenings from "./screenings/AvailableScreenings";
import Reservation from "./screenings/Reservation";
import ReservationConfirmation from "./screenings/ReservationConfirmation";
import Reservations from "./dashboard/Reservations";
import UserProfile, { UserInfos } from "./dashboard/UserProfile";
import ProfileUpdate from "./dashboard/ProfileUpdate";
import AdminSidebar from "./dashboard/AdminSidebar";
import UserList from "./dashboard/UserList";
import MovieGallery from "./dashboard/MovieGallery";
import CreateMovie from "./dashboard/CreateMovie";
import EditMovie from "./dashboard/EditMovie";
import FavoritesList from "./dashboard/FavoritesList";
import Statistics from "./dashboard/Statistics";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const isDashboard = location.pathname === "/dashboard";
  const adminDashboard = location.pathname === "/adminDashboard";

  return (
    <div className="App">
      {!isDashboard && !adminDashboard && (
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      )}
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route
          path="/password/reset-password/:userId/:token"
          element={<ResetPassword />}
        />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/success" element={<Success />} />

        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSidebar
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movies"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MovieGallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies/create"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateMovie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movies/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditMovie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/statistics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Statistics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <SideBar
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/screenings" element={<AvailableScreenings />} />
        <Route
          path="/reservation/:screeningId"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <Reservation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservation-confirmation"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ReservationConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="history"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <Reservations userId={localStorage.getItem("userId")} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profileUpdate"
          element={
            <ProtectedRoute allowedRoles={["client", "admin"]}>
              <UserInfos userId={localStorage.getItem("userId")} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <FavoritesList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
