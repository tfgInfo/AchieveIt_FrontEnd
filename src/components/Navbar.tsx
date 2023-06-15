import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

type NavbarProps = {
  isLoggedIn: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  handleLogin,
  handleLogout,
}) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand">
          Achieve It
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto d-flex">
            <li className="nav-item">
              <Link to="/list-videogames" className="nav-link">
                Videojuegos BD
              </Link>
            </li>
            <li className="nav-item ">
              <Link to="/User-list-videogames" className="nav-link">
                Mi lista
              </Link>
            </li>
          </ul>
        </div>
        <div className="ml-auto">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Opciones
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {isLoggedIn ? (
                <li>
                  <Link to="/userStatistics" className="dropdown-item ">
                    Estadísticas
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </li>
              ) : (
                <li>
                  <button className="dropdown-item" onClick={handleLogin}>
                    Iniciar sesión
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
