import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Videogames from "./components/Videogames";
import Navbar from "./components/Navbar";
import UserVideogamesList from "./components/UserVideogamesList";
import { AuthContext } from "./components/AuthContext";
import VideogameDetails from "./components/VideogameDetails";
import CreateAchievement from "./components/CreateAchievement";
import UserStatistics from "./components/UserStatistics";
import ModifyAchievement from "./components/modifyAchievement";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      fetch(`http://localhost:8080/api/users/${token}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setIsLoggedIn(data.loggedIn);
          setToken(token);
        })
        .catch((error) => {
          console.error("error", error);
        });
    }
  }, []);

  const handleLogin = () => {
    const redirectUrl = "http://localhost:8080/login";
    window.location.href = redirectUrl;
  };

  const handleLogout = () => {
    const redirectUrl = "http://localhost:8080/logout";
    window.location.href = redirectUrl;
  };

  return (
    <Router>
      <AuthContext.Provider value={{ token }}>
        <Navbar
          isLoggedIn={isLoggedIn}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
        <div className="container">
          {isLoggedIn ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/list-videogames" element={<Videogames />} />
              <Route
                path="/User-list-videogames"
                element={<UserVideogamesList />}
              />
              <Route
                path="/crear-logro/:videogameId"
                element={<CreateAchievement />}
              />
              <Route path="/userStatistics" element={<UserStatistics />} />
              <Route
                path="/userStatistics/:userId"
                element={<UserStatistics />}
              />
              <Route path="/videogame/:id" element={<VideogameDetails />} />
              <Route
                path="/modificar-logro/:achievementId"
                element={<ModifyAchievement />}
              />
            </Routes>
          ) : (
            <div className="alert alert-info mt-4">
              Antes de utilizar la App, debes iniciar sesión.
            </div>
          )}
        </div>
      </AuthContext.Provider>
    </Router>
  );
};
export default App;
