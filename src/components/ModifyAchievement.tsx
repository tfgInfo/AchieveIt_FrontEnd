import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const ModifyAchievement = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const { achievementId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `http://localhost:8080/api/personalized-achievements/${achievementId}`,
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
        setName(data.name);
        setDescription(data.description);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handleCancel = () => {
    navigate("/userStatistics");
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setDescription(value);
    validateDescription(value);
  };

  const validateName = (value: string) => {
    if (!value) {
      setNameError("El nombre es obligatorio.");
    } else if (value.length < 3) {
      setNameError("El nombre debe tener al menos 3 caracteres.");
    } else {
      setNameError("");
    }
  };

  const validateDescription = (value: string) => {
    if (!value) {
      setDescriptionError("La descripción es obligatoria.");
    } else if (value.length < 10) {
      setDescriptionError("La descripción debe tener al menos 10 caracteres.");
    } else {
      setDescriptionError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/api/personalized-achievements/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            description: description,
            achievementId: achievementId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al modificar el logro personalizado.");
      }

      console.log("Logro personalizado creado con éxito");
      setName("");
      setDescription("");
      navigate(`/userStatistics`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4 mb-4">Modificar Logro</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nombre:
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={handleNameChange}
          />
          {nameError && <div className="text-danger">{nameError}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Descripción:
          </label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={handleDescriptionChange}
          />
          {descriptionError && (
            <div className="text-danger">{descriptionError}</div>
          )}
        </div>
        <button
          type="button"
          className="btn btn-primary ms-4 float-end"
          onClick={handleCancel}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary float-end">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default ModifyAchievement;
