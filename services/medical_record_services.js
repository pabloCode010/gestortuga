const { pool } = require("../database/pool");

async function createMedicalRecord({ date, weight, diagnosis, treatment, id_turtle, id_user }) {
  const query = "INSERT INTO Historiales_Medicos (fecha, peso, diagnostico, tratamiento, id_tortuga, id_usuario) VALUES (?, ?, ?, ?, ?, ?)";
  const [result] = await pool.query(
    query,
    [date, weight, diagnosis, treatment, id_turtle, id_user]
  );

  return {
    id: result.insertId,
    date, weight, diagnosis, treatment, id_turtle, id_user,
  };
}

async function getMedicalRecords({ id, date, id_turtle, id_user }) {
  const query = `
    SELECT id, fecha, peso, diagnostico, tratamiento, id_tortuga, id_usuario
    FROM Historiales_Medicos
    WHERE (? IS NULL OR ? = '' OR id = ?) AND
          ((? IS NULL OR ? = '') OR fecha = ?) AND
          (? IS NULL OR ? = '' OR id_tortuga = ?) AND
          (? IS NULL OR ? = '' OR id_usuario = ?)
  `;
  if (date === "") {
    date = null;
  }
  const [rows] = await pool.query(query, [
    id, id, id,
    date, date, date,
    id_turtle, id_turtle, id_turtle,
    id_user, id_user, id_user
  ]);

  return rows.map((medicalRecord) => ({
    id: medicalRecord.id,
    date: medicalRecord.fecha,
    weight: medicalRecord.peso,
    diagnosis: medicalRecord.diagnostico,
    treatment: medicalRecord.tratamiento,
    id_turtle: medicalRecord.id_tortuga,
    id_user: medicalRecord.id_usuario,
  }));
}

async function deleteMedicalRecordById(id) {
  const query = "DELETE FROM Historiales_Medicos WHERE id = ?";
  await pool.query(query, [id]);
}

async function updateMedicalRecordById(id, { date, weight, diagnosis, treatment, id_turtle, id_user }) {
  const query = `
    UPDATE Historiales_Medicos
    SET fecha = ?, peso = ?, diagnostico = ?, tratamiento = ?, id_tortuga = ?, id_usuario = ?
    WHERE id = ?
  `;

  await pool.query(query, [date, weight, diagnosis, treatment, id_turtle, id_user, id]);
  return { id, date, weight, diagnosis, treatment, id_turtle: id_user };
}

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  deleteMedicalRecordById,
  updateMedicalRecordById,
};