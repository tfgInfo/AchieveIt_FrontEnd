import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";

const UserVideogamesList = () => {
  const { token } = useContext(AuthContext);
  const [userVideogamesList, setUserVideogamesList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${token}/videogames`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los videojuegos del usuario.");
        }

        const userVideogamesData = await response.json();
        const updatedUserVideogames = await Promise.all(
          userVideogamesData.map(async (videogame) => {
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

        setUserVideogamesList(updatedUserVideogames);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="mt-4">Lista de videojuegos</h2>
      <div className="row">
        {userVideogamesList.length > 0 ? (
          userVideogamesList
            .sort((a, b) => a.id - b.id)
            .map((videogame, index) => (
              <div className="col-md-2 mt-4" key={index}>
                <Link
                  to={`/videogame/${videogame.id}`}
                  className="videogame-link text-decoration-none"
                >
                  <div className="card">
                    {videogame.coverUrl ? (
                      <img
                        src={videogame.coverUrl}
                        alt={`Carátula de ${videogame.name}`}
                        className="card-img-top img-fluid"
                      />
                    ) : (
                      <img
                        src="src\assets\image-not-found.png"
                        alt="Carátula no disponible"
                        className="card-img-top img-fluid"
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{videogame.name}</h5>
                    </div>
                  </div>
                </Link>
              </div>
            ))
        ) : (
          <div className="alert alert-info mt-4">
            No has añadido juegos a tu lista todavía
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVideogamesList;
