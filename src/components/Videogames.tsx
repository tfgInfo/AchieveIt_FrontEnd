import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const Videogames = () => {
  const [videogames, setVideogamesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVideogames = async () => {
      try {
        let url = `http://localhost:8080/api/videogames?page=${currentPage}`;

        if (selectedGenre !== "") {
          url = `http://localhost:8080/api/videogames/genres?page=${currentPage}&genre=${selectedGenre}`;
        }

        if (searchTerm !== "") {
          url = `http://localhost:8080/api/videogames/name?page=${currentPage}&name=${searchTerm}`;
        }

        const response = await fetch(url, {
          method: "get",
          headers: {
            "content-type": "application/json",
          },
        });
        const data = await response.json();

        setVideogamesList(data);
      } catch (error) {
        console.error("error", error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/genres", {
          method: "get",
          headers: {
            "content-type": "application/json",
          },
        });
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("error", error);
      }
    };

    fetchGenres();
    fetchVideogames();
  }, [currentPage, selectedGenre, searchTerm]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    setCurrentPage(0);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  return (
    <div className="container">
      <h2 className="mt-4">Lista de videojuegos</h2>
      <div className="mb-3">
        <label htmlFor="genreSelect" className="form-label">
          Género:
        </label>
        <select
          id="genreSelect"
          className="form-select"
          onChange={handleGenreChange}
        >
          <option value="">Todos</option>
          {genres.map((genre) => (
            <option value={genre.id} key={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="searchInput" className="form-label">
          Buscar:
        </label>
        <input
          type="text"
          id="searchInput"
          className="form-control"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>
      <ul className="list-group">
        {videogames.map((videogame, index) => (
          <li className="list-group-item" key={index}>
            <Link to={`/videogame/${videogame.id}`} className="videogame-link">
              <span>
                {videogame.id} - {videogame.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <button
          className="btn btn-secondary me-2"
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
        >
          Previous Page
        </button>
        <button className="btn btn-secondary" onClick={handleNextPage}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default Videogames;
