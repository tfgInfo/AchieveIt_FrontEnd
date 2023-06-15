import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const VideogameDetails = () => {
  const [videogame, setVideogame] = useState(null);
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [isGameInList, setIsGameInList] = useState(false);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [personalizedAchievementUsers, setPersonalizedAchievementUsers] =
    useState([]);
  const [
    selectedPersonalizedAchievements,
    setSelectedPersonalizedAchievements,
  ] = useState([]);
  const [personalizedAchievements, setPersonalizedAchievements] = useState([]);
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState({});
  const [ranking, setRanking] = useState([]);

  const handleAddtoList = (id) => {
    const requestBody = { videogameId: id };
    fetch(`http://localhost:8080/api/videogames/add/${token}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.data)
      .then((data) => {
        console.log("Videojuego guardado:", data);
        setIsGameInList(true);
      })
      .catch((error) => {
        console.error("Error al guardar el videojuego:", error);
      });
  };

  const handleRemoveFromList = (id) => {
    const requestBody = { videogameId: id };
    fetch(`http://localhost:8080/api/videogames/delete/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.data)
      .then((data) => {
        console.log("Videojuego eliminado:", data);
        setIsGameInList(false);
      })
      .catch((error) => {
        console.error("Error al eliminar el videojuego:", error);
      });
  };

  const handleLike = (personalizedAchievementId) => {
    const isLikedByUser = isLiked[personalizedAchievementId];

    if (isLikedByUser) {
      fetch(
        `http://localhost:8080/api/personalized-achievements/${personalizedAchievementId}/dislike/${token}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            console.log("Dislike guardado correctamente");
            setIsLiked((prevIsLiked) => ({
              ...prevIsLiked,
              [personalizedAchievementId]: false,
            }));
          } else {
            console.error("Error al guardar el Dislike");
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud: ", error);
        });
    } else {
      fetch(
        `http://localhost:8080/api/personalized-achievements/${personalizedAchievementId}/like/${token}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            console.log("Me gusta guardado correctamente");
            setIsLiked((prevIsLiked) => ({
              ...prevIsLiked,
              [personalizedAchievementId]: true,
            }));
          } else {
            console.error("Error al guardar el Me gusta");
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud: ", error);
        });
    }
  };

  const handleAchievementClick = (achievementId) => {
    const requestBody = { achievementId: achievementId };
    if (selectedAchievements.includes(achievementId)) {
      setSelectedAchievements((prevSelected) =>
        prevSelected.filter((id) => id !== achievementId)
      );
      fetch(`http://localhost:8080/api/achievements/remove/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => response.data)
        .then((data) => {
          console.log("Logro eliminado:", data);
        })
        .catch((error) => {
          console.error("Error al eliminar el logro:", error);
        });
    } else {
      setSelectedAchievements((prevSelected) => [
        ...prevSelected,
        achievementId,
      ]);
      fetch(`http://localhost:8080/api/achievements/add/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => response.data)
        .then((data) => {
          console.log("Logro guardado:", data);
        })
        .catch((error) => {
          console.error("Error al guardar el logro:", error);
        });
    }
  };

  const handlePersonalizedAchievementClick = (personalizedAchievementId) => {
    const requestBody = {
      personalizedAchievementId: personalizedAchievementId,
    };
    if (selectedPersonalizedAchievements.includes(personalizedAchievementId)) {
      setSelectedPersonalizedAchievements((prevSelected) =>
        prevSelected.filter((id) => id !== personalizedAchievementId)
      );
      fetch(
        `http://localhost:8080/api/personalized-achievements/remove/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(requestBody),
        }
      )
        .then((response) => response.data)
        .then((data) => {
          console.log("Logro personalizado eliminado:", data);
        })
        .catch((error) => {
          console.error("Error al eliminar el logro personalizado:", error);
        });
    } else {
      setSelectedPersonalizedAchievements((prevSelected) => [
        ...prevSelected,
        personalizedAchievementId,
      ]);
      fetch(
        `http://localhost:8080/api/personalized-achievements/add/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(requestBody),
        }
      )
        .then((response) => response.data)
        .then((data) => {
          console.log("Logro personalizado guardado:", data);
        })
        .catch((error) => {
          console.error("Error al eliminar el logro personalizado:", error);
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/videogames/${id}`
        );
        if (!response.ok) {
          throw new Error(
            "Error al obtener los videojuegos recientes del usuario."
          );
        }
        const videogameData = await response.json();

        const responseCover = await fetch(
          `http://localhost:8080/api/videogames/${videogameData.name}/cover`
        );
        const coverUrl = await responseCover.text();

        const updatedVideogame = {
          ...videogameData,
          coverUrl: coverUrl,
        };

        setVideogame(updatedVideogame);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:8080/api/achievements/videogame/${id}/user/${token}`,
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
        setSelectedAchievements(data);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:8080/api/personalized-achievements/videogame/${id}/user/${token}`,
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
        setSelectedPersonalizedAchievements(data);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:8080/api/personalized-achievements/videogame/${id}`,
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
      .then(async (data) => {
        setPersonalizedAchievements(data);

        const users = data.map((personalizedAchievement) =>
          fetch(
            `http://localhost:8080/api/personalized-achievements/${personalizedAchievement.id}/user`,
            {
              method: "get",
              headers: {
                "Content-Type": "application/json",
              },
            }
          ).then((response) => response.json())
        );

        Promise.all(users)
          .then((usersData) => {
            setPersonalizedAchievementUsers(usersData);
          })
          .catch((error) => {
            console.error("Error", error);
          });
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/api/videogames/${id}/${token}`, {
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
        setIsGameInList(data);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, []);

  useEffect(() => {
    const fetchTopRanking = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/personalized-achievements/videogame/${id}/ranking`
        );
        const data = await response.json();

        setRanking(data);
      } catch (error) {
        console.error(`Error al obtener el ranking`, error);
      }
    };
    fetchTopRanking();
  });

  useEffect(() => {
    const fetchIsLiked = async (personalizedAchievementId) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/personalized-achievements/${personalizedAchievementId}/liked-by/${token}`
        );
        const isLikedByUser = await response.json();
        setIsLiked((prevIsLiked) => ({
          ...prevIsLiked,
          [personalizedAchievementId]: isLikedByUser,
        }));
      } catch (error) {
        console.error(
          `Error al obtener información de 'Me gusta' para el Logro personalizado - ${personalizedAchievementId}:`,
          error
        );
        setIsLiked((prevIsLiked) => ({
          ...prevIsLiked,
          [personalizedAchievementId]: false,
        }));
      }
    };

    personalizedAchievements.forEach((achievement) => {
      if (achievement.id) {
        fetchIsLiked(achievement.id);
      }
    });
  }, [personalizedAchievements, token]);

  const handleCreateAchievement = () => {
    navigate(`/crear-logro/${id}`);
  };

  return (
    <div className="mt-4">
      {videogame && (
        <ul>
          <div className="container mt-4">
            <div className="d-flex align-items-center">
              <div className="card" style={{ width: "160px", height: "140px" }}>
                <img
                  src={videogame.coverUrl}
                  alt={`Carátula de ${videogame.name}`}
                  className="card-img-top img-fluid"
                />
              </div>
              <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h1>
                    <strong>{videogame.name}</strong>
                  </h1>
                  {!isGameInList ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddtoList(videogame.id)}
                    >
                      Add to List
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleRemoveFromList(videogame.id)}
                    >
                      Remove from List
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-6">
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>Géneros:</strong>
                  <ul className="list-group">
                    {videogame.genres
                      .sort((a, b) => a.id - b.id)
                      .map((genre) => (
                        <li key={genre.id} className="list-group-item">
                          {genre.name}
                        </li>
                      ))}
                  </ul>
                </li>
                <li className="list-group-item">
                  <strong>Editores:</strong>
                  <ul className="list-group">
                    {videogame.publishers
                      .sort((a, b) => a.id - b.id)
                      .map((publisher) => (
                        <li key={publisher.id} className="list-group-item">
                          {publisher.name}
                        </li>
                      ))}
                  </ul>
                </li>
                <li className="list-group-item">
                  <strong>Desarrolladores:</strong>
                  <ul className="list-group">
                    {videogame.developers
                      .sort((a, b) => a.id - b.id)
                      .map((developer) => (
                        <li key={developer.id} className="list-group-item">
                          {developer.name}
                        </li>
                      ))}
                  </ul>
                </li>
                <li className="list-group-item">
                  <strong>Plataformas:</strong>
                  <ul className="list-group">
                    {videogame.platforms
                      .sort((a, b) => a.id - b.id)
                      .map((platform) => (
                        <li key={platform.id} className="list-group-item">
                          {platform.name}
                        </li>
                      ))}
                  </ul>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    Ranking Top 10 Logros personalizados
                  </h5>
                  <ul className="list-group">
                    {ranking.length > 0 ? (
                      ranking.map((personalizedAchievement) => (
                        <li
                          key={personalizedAchievement.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {personalizedAchievement.name}
                          <span className="badge bg-primary">
                            Likes: {personalizedAchievement.likesNum}
                          </span>
                        </li>
                      ))
                    ) : (
                      <div className="alert alert-info mt-4">
                        Aún no existen Logros personalizados
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="ms-auto">
              <button
                className="btn btn-primary"
                onClick={handleCreateAchievement}
              >
                Crear logro personalizado
              </button>
            </div>
          </div>
          <div className="card">
            <div
              className={`card-header d-flex justify-content-between align-items-center ${
                isCollapseOpen ? "active" : ""
              }`}
              onClick={() => setIsCollapseOpen(!isCollapseOpen)}
              role="button"
              aria-expanded={isCollapseOpen}
            >
              <h4 className="mb-0">Logros</h4>
              <i
                className="bi bi-chevron-down"
                style={{ fontSize: "24px" }}
              ></i>
            </div>
            <div className={`collapse ${isCollapseOpen ? "show" : ""}`}>
              <div className="row">
                <div className=" col-md-6">
                  {videogame.achievements.length === 0 ? (
                    <div className="list-group list-group-flush mt-2">
                      <div className="alert alert-info mt-2 ms-3">
                        Aún no existen Logros
                      </div>
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {videogame.achievements
                        .sort((a, b) => a.id - b.id)
                        .map((achievement, index) => (
                          <li
                            key={achievement.id}
                            className={`list-group-item`}
                            onClick={() =>
                              handleAchievementClick(achievement.id)
                            }
                          >
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedAchievements.includes(
                                  achievement.id
                                )}
                                onChange={() =>
                                  handleAchievementClick(achievement.id)
                                }
                              />
                              <label className="form-check-label">
                                {index + 1} - {achievement.name}
                              </label>
                            </div>
                            <label className="form-check-label">
                              {achievement.description}
                            </label>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
                <div className="col-md-6">
                  {personalizedAchievements.length === 0 ? (
                    <div className="list-group list-group-flush mt-2">
                      <div className="alert alert-info mt-2">
                        Aún no se han creado Logros
                      </div>
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {personalizedAchievements
                        .sort((a, b) => a.id - b.id)
                        .map((personalizedAchievements, index) => (
                          <li
                            key={personalizedAchievements.id}
                            className={`list-group-item`}
                            onClick={() =>
                              handlePersonalizedAchievementClick(
                                personalizedAchievements.id
                              )
                            }
                          >
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedPersonalizedAchievements.includes(
                                  personalizedAchievements.id
                                )}
                                onChange={() =>
                                  handlePersonalizedAchievementClick(
                                    personalizedAchievements.id
                                  )
                                }
                              />
                              <label className="form-check-label">
                                {index + 1} - {personalizedAchievements.name}
                              </label>
                            </div>
                            <label className="form-check-label">
                              {personalizedAchievements.description}
                            </label>
                            <div className="d-flex justify-content-between">
                              <div>
                                {personalizedAchievementUsers.length > 0 && (
                                  <div className="user-info created-by small text-muted">
                                    Creado por:{" "}
                                    <Link
                                      to={`/userStatistics/${personalizedAchievementUsers[index].id}`}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                      }}
                                    >
                                      {personalizedAchievementUsers[index].name}
                                    </Link>
                                  </div>
                                )}
                              </div>
                              <div>
                                <button
                                  className={`btn btn-primary btn-sm ${
                                    isLiked[personalizedAchievements.id]
                                      ? "liked"
                                      : ""
                                  }`}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleLike(personalizedAchievements.id);
                                  }}
                                >
                                  {isLiked[personalizedAchievements.id]
                                    ? "No Me gusta"
                                    : "Me gusta"}
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ul>
      )}
    </div>
  );
};

export default VideogameDetails;
