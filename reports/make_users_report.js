const PDFDocument = require("pdfkit");
const drawTable = require("./draw_table.js");
const { pool } = require("../database/pool.js");

async function makeUsersReport(res) {
  const doc = new PDFDocument();
  doc.pipe(res);

  doc
    .fontSize(24)
    .fillColor("#4CAF50")
    .text("GesTortuga", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(14)
    .fillColor("black")
    .text("Reporte de usuarios del sistema", { align: "center" })
    .moveDown(0.2);

  const curdate = new Date().toLocaleDateString();
  doc
    .fontSize(10)
    .fillColor("gray")
    .text(`Fecha: ${curdate}`, { align: "center" })
    .moveDown(1);

  doc
    .moveTo(50, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .strokeColor("#4CAF50")
    .stroke()
    .moveDown(1);

  const pageWidth = doc.page.width;
  const rowHeight = 25;
  const columnWidths = [30, 90, 90, 90, 120, 80, 90];
  const totalTableWidth = columnWidths.reduce((acc, width) => acc + width, 0);
  const startX = (pageWidth - totalTableWidth) / 2;
  const startY = doc.y;

  const header = ["ID", "Nombre", "Apellido Paterno", "Apellido Materno", "Email", "Usuario", "Rol"];
  const users = await getUsersInArray();

  drawTable(doc, [header, ...users] , startX, startY, rowHeight, columnWidths);

  doc.end();
}

async function getUsersInArray() {
  const query = `
    SELECT u.id, u.nombre, u.apellido_pat, u.apellido_mat, u.email, u.usuario, r.nombre as rol 
    FROM Usuarios u 
    JOIN Roles r 
    ON u.id_rol = r.id`;

  const [rows] = await pool.query(query);
  const data = rows.map((user) => [
    user.id,
    user.nombre,
    user.apellido_pat,
    user.apellido_mat,
    user.email,
    user.usuario,
    user.rol,
  ]);
  
  return data;
}

module.exports = {
  makeUsersReport,
  getUsersInArray,
}
