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
    setIsLoggedIn(false);
    navigate("/login");
  };

  const isDashboard = location.pathname === "/dashboard";
  const adminDashboard = location.pathname === "/adminDashboard";

  return (
    <div className="App">
      {!isDashboard && (
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
            <AdminSidebar
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              handleLogout={handleLogout}
            />
          }
        />
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/movies" element={<MovieGallery />} />
        <Route path="/movies/create" element={<CreateMovie />} />
        <Route path="/admin/movies/edit/:id" element={<EditMovie />} />
        <Route path="/favorites" element={<FavoritesList />} />
        <Route path="/admin/statistics" element={<Statistics />} />

        <Route
          path="/dashboard"
          element={
            <SideBar
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              handleLogout={handleLogout}
            />
          }
        />

        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/screenings/:movieId" element={<AvailableScreenings />} />
        <Route path="/reservation/:screeningId" element={<Reservation />} />
        <Route
          path="/reservation-confirmation"
          element={<ReservationConfirmation />}
        />
        <Route
          path="history"
          element={<Reservations userId={localStorage.getItem("userId")} />}
        />
        <Route
          path="/profileUpdate"
          element={<UserInfos userId={localStorage.getItem("userId")} />}
        />
      </Routes>
    </div>
  );
}

export default App;
