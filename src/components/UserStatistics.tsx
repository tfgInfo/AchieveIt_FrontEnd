import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useParams } from "react-router-dom";

const UserStatistics = () => {
  const { userId: urlUserId } = useParams();
  const { token: contextToken } = useContext(AuthContext);
  const token = urlUserId ? urlUserId : contextToken;
  const [personalizedAchievements, setPersonalizedAchievements] = useState({});
  const [user, setUser] = useState();
  const [videogameCovers, setVideogameCovers] = useState({});
  const [expandedVideogame, setExpandedVideogame] = useState("");
  const [totalLikesNum, setTotalLikesNum] = useState(0);
  const totalAchievements = Object.values(personalizedAchievements).reduce(
    (total, achievements) => total + achievements.length,
    0
  );
  const [totalVideogamesAdded, setTotalVideogamesAdded] = useState(0);
  useEffect(() => {
    fetch(`http://localhost:8080/api/users/${token}`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, [token]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/${token}/videogamesTotal`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTotalVideogamesAdded(data);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:8080/api/personalized-achievements/user/${token}/likes`,
      {
        method: "get",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTotalLikesNum(data);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, [token]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/personalized-achievements/user/${token}`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setPersonalizedAchievements(data);

        const coverUrls = {};

        const fetchPromises = Object.keys(data).map((videogame) =>
          fetch(`http://localhost:8080/api/videogames/${videogame}/cover`)
            .then((response) => response.text())
            .then((coverUrl) => {
              coverUrls[videogame] = coverUrl;
            })
            .catch((error) => {
              console.error(
                "Error al obtener la portada del videojuego:",
                error
              );
            })
        );

        Promise.all(fetchPromises)
          .then(() => {
            setVideogameCovers(coverUrls);
          })
          .catch((error) => {
            console.error(
              "Error al obtener las portadas de los videojuegos:",
              error
            );
          });
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, [token]);

  const handleToggleExpansion = (videogame) => {
    if (expandedVideogame === videogame) {
      setExpandedVideogame("");
    } else {
      setExpandedVideogame(videogame);
    }
  };

  return (
    <div>
      <div className="card mt-4 p-4">
        {user && <h4 className="mb-4">Estadísticas de {user.name}</h4>}
        <div className="row">
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Likes totales</h5>
                <p className="card-text">{totalLikesNum}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Logros creados totales</h5>
                <p className="card-text">{totalAchievements}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Juegos Añadidos totales</h5>
                <p className="card-text">{totalVideogamesAdded}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 className="mt-4">Logros personalizados creados</h2>
      {Object.keys(personalizedAchievements).length > 0 ? (
        Object.entries(personalizedAchievements).map(
          ([videogame, achievements]) => (
            <div key={videogame} className="mt-4 border rounded p-3">
              <div className="container mt-4">
                <div
                  className="d-flex align-items-center"
                  onClick={() => handleToggleExpansion(videogame)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="card"
                    style={{ width: "160px", height: "140px" }}
                  >
                    <img
                      src={videogameCovers[videogame]}
                      alt={`Carátula de ${videogame}`}
                      className="card-img-top img-fluid"
                    />
                  </div>
                  <div className="container mt-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h1 className="mb-3">
                        <strong>{videogame}</strong>
                      </h1>
                      <i
                        className="bi bi-chevron-down"
                        style={{ fontSize: "24px" }}
                      ></i>
                    </div>
                  </div>
                </div>
                {expandedVideogame === videogame && (
                  <ul className="list-group mt-4 ">
                    {achievements.map((achievement) => (
                      <li className="list-group-item" key={achievement.id}>
                        <div className="row">
                          <div className="col-md-6">
                            <h4 className="mt-2">Nombre: {achievement.name}</h4>
                            <h4>Descripción: {achievement.description}</h4>
                          </div>
                          <div className="col-md-6 text-end">
                            <Link
                              to={`/modificar-logro/${achievement.id}`}
                              className="btn btn-primary"
                            >
                              Modificar
                            </Link>
                          </div>
                        </div>
                        <span className="badge bg-primary float-end">
                          Likes: {achievement.likesNum}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )
        )
      ) : (
        <div className="alert alert-info mt-4">
          No has añadido juegos a tu lista todavía
        </div>
      )}
    </div>
  );
};

export default UserStatistics;
