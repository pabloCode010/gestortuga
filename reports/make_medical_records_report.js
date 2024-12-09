const PDFDocument = require("pdfkit");
const drawTable = require("./draw_table.js");
const { pool } = require("../database/pool.js");
const { getTurtlesInArray } = require("./make_turtles_report.js");

async function makeMedicalRecordsReport(res) {
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
      .text("Reporte de Historiales Médicos del sistema", { align: "center" })
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
    const columnWidths = [70, 70, 100, 100, 150];
    const totalTableWidth = columnWidths.reduce((acc, width) => acc + width, 0);
    const startX = (pageWidth - totalTableWidth) / 2;
  
    const turtles = await getTurtlesInArray();
    const header = ["Fecha", "Peso", "Diagnóstico", "Tratamiento", "Usuario"];
  
    for (const turtle of turtles) {
      if (doc.y + rowHeight * 2 > doc.page.height - 50) {
        doc.addPage();
      }
  
      doc
        .fontSize(14)
        .fillColor("black")
        .text(`Tortuga #${turtle[0]}`, 50, doc.y)
        .moveDown(0.2);
  
      const medicalReports = await getMedicalReportsInArrayByTurtleId(turtle[0]);
  
      const tableHeight = (medicalReports.length + 1) * rowHeight;
      if (doc.y + tableHeight > doc.page.height - 50) {
        doc.addPage();
      }

      drawTable(
        doc,
        [header, ...medicalReports],
        startX,
        doc.y,
        rowHeight,
        columnWidths
      );

      doc.y += tableHeight + 5;
    }
  
    doc.end();
  }
  
async function getMedicalReportsInArrayByTurtleId(turtleId) {
  const query = `
    SELECT h.fecha, h.peso, h.diagnostico, h.tratamiento, CONCAT(u.nombre, ' ', u.apellido_pat, ' ', u.apellido_mat) as usuario
    FROM Historiales_Medicos h
    INNER JOIN Usuarios u
    ON h.id_usuario = u.id
    WHERE h.id_tortuga = ?
    ORDER BY fecha ASC; `;

  const [rows] = await pool.query(query, [turtleId]);
  const data = rows.map((record) => [
    new Date(record.fecha).toLocaleDateString(),
    record.peso + " kg",
    record.diagnostico,
    record.tratamiento,
    record.usuario,
  ]);

  return data;
}

module.exports = {
  makeMedicalRecordsReport,
  getMedicalReportsInArrayByTurtleId,
};
