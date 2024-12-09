const PDFDocument = require("pdfkit");
const drawTable = require("./draw_table.js");
const { pool } = require("../database/pool");

async function makeTurtlesReport(res) {
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
    .text("Reporte de tortugas del sistema", { align: "center" })
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
  const columnWidths = [30, 60, 60, 70, 100, 70, 70, 80];
  const totalTableWidth = columnWidths.reduce((acc, width) => acc + width, 0);
  const startX = (pageWidth - totalTableWidth) / 2;
  const startY = doc.y;

  const header = ["#", "Sexo", "Ancho", "Largo", "Ancho de plasta", "Largo de plasta", "Estado de salud", "Especie"];
  const turtles = await getTurtlesInArray();

  drawTable(doc, [header, ...turtles] , startX, startY, rowHeight, columnWidths);

  doc.end();
}

async function getTurtlesInArray() {
  const query = `
    SELECT t.id, t.sexo, t.ancho, t.largo, t.ancho_plasta, t.largo_plasta, t.estado_salud, e.nombre as especie
    FROM Tortugas t
    JOIN Especies e
    ON t.id_especie = e.id
    ORDER BY t.id`;

  const [rows] = await pool.query(query);
  const data = rows.map((turtle) => [
    turtle.id,
    turtle.sexo,
    turtle.ancho,
    turtle.largo,
    turtle.ancho_plasta,
    turtle.largo_plasta,
    turtle.estado_salud,
    turtle.especie,
  ]);
  
  return data;
}

module.exports = {
  makeTurtlesReport,
  getTurtlesInArray,
}
