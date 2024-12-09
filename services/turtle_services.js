const { pool } = require("../database/pool");

async function createTurtle({ genre, width, height, width_shell, height_shell, health_status, id_species }) {
  const query = "INSERT INTO Tortugas (sexo, ancho, largo, ancho_plasta, largo_plasta, estado_salud, id_especie) VALUES (?, ?, ?, ?, ?, ?, ?)";const [result] = await pool.query(
    query,
    [genre, width, height, width_shell, height_shell, health_status, id_species]
  );

  return {
    id: result.insertId,
    genre, width, height, width_shell, height_shell, health_status, id_species,
  };
}

async function getTurtles({ id, genre, health_status, id_species }) {
  const query = `
    SELECT id, sexo, ancho, largo, ancho_plasta, largo_plasta, estado_salud, id_especie
    FROM Tortugas
    WHERE (? IS NULL OR ? = '' OR id = ?) AND
          (? IS NULL OR ? = '' OR sexo = ?) AND
          (? IS NULL OR ? = '' OR estado_salud = ?) AND
          (? IS NULL OR ? = '' OR id_especie = ?)
  `;

  const [rows] = await pool.query(query, [
    id, id, id,
    genre, genre, genre,
    health_status, health_status, health_status,
    id_species, id_species, id_species
  ]);

  return rows.map((turtle) => ({
    id: turtle.id,
    genre: turtle.sexo,
    width: turtle.ancho,
    height: turtle.largo,
    width_shell: turtle.ancho_plasta,
    height_shell: turtle.largo_plasta,
    health_status: turtle.estado_salud,
    id_species: turtle.id_especie,
  }));
}

async function deleteTurtleById(id) {
  const query = "DELETE FROM Tortugas WHERE id = ?";
  await pool.query(query, [id]);
}

async function updateTurtleById(id, { genre, width, height, width_shell, height_shell, health_status, id_species }) {
  const query = `
    UPDATE Tortugas
    SET sexo = ?, ancho = ?, largo = ?, ancho_plasta = ?, largo_plasta = ?, estado_salud = ?, id_especie = ?
    WHERE id = ?
  `;

  await pool.query(query, [genre, width, height, width_shell, height_shell, health_status, id_species, id]);
  return { id, genre, width, height, width_shell, height_shell, health_status, id_species};
}

async function getSpecies(){
  const query = "SELECT * FROM Especies";
  const [rows] = await pool.query(query);

  return rows.map((species) => ({
    id: species.id,
    name: species.nombre,
  }));
}

module.exports = {
  createTurtle,
  getTurtles,
  deleteTurtleById,
  updateTurtleById,
  getSpecies,
};
