import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const [recentVideogames, setRecentVideogames] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${token}/recent-videogames`
        );
        if (!response.ok) {
          throw new Error(
            "Error al obtener los videojuegos recientes del usuario."
          );
        }
        const recentVideogamesData = await response.json();

        const updatedRecentVideogames = await Promise.all(
          recentVideogamesData.map(async (videogame) => {
            const response = await fetch(
              `http://localhost:8080/api/videogames/${videogame.name}/cover`
            );
            const coverUrl = await response.text();
            return {
              ...videogame,
              coverUrl: coverUrl,
            };
          })
        );

        setRecentVideogames(updatedRecentVideogames);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRecentAchievements = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${token}/recent-achievements`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los logros recientes del usuario.");
        }
        const data = await response.json();
        setRecentAchievements(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecentAchievements();
  }, []);

  return (
    <div className="mt-4">
      <h1>Últimos videojuegos añadidos</h1>
      <div>
        {recentVideogames.length > 0 ? (
          <div className="row">
            {recentVideogames.map((videogame, index) => (
              <div className="col-md-2 mt-4" key={index}>
                <Link
                  to={`/videogame/${videogame.id}`}
                  className="videogame-link text-decoration-none"
                >
                  <div className="card">
                    {videogame.coverUrl && (
                      <img
                        src={videogame.coverUrl}
                        alt={`Carátula de ${videogame.name}`}
                        className="card-img-top img-fluid"
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{videogame.name}</h5>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info mt-4">
            No has añadido juegos a tu lista todavía
          </div>
        )}
      </div>
      <div>
        <h1 className="mt-4">Últimos Logros completados</h1>
        {recentAchievements.length > 0 ? (
          <ul className="list-group mt-4">
            {recentAchievements.map((achievement, index) => (
              <li className="list-group-item" key={index}>
                <div>{achievement.name}</div>
                <label>{achievement.description}</label>
              </li>
            ))}
          </ul>
        ) : (
          <div className="alert alert-info mt-4">
            No has completado ningún logro todavía
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
