const PDFDocument = require("pdfkit");
const drawTable = require("./draw_table.js");

const { getTurtlesInArray } = require("./make_turtles_report.js");
const { getUsersInArray } = require("./make_users_report.js");
const { getMedicalReportsInArrayByTurtleId } = require("./make_medical_records_report.js");

async function makeGeneralReport(res) {
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
    .text("Reporte General del sistema", { align: "center" })
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

  doc
    .fontSize(18)
    .fillColor("#132a13")
    .text("TORTUGAS", { align: "center" })
    .moveDown(0.5);

  const pageWidth = doc.page.width;
  const rowHeight = 25;
  const turtlesColumnWidths = [30, 60, 60, 70, 100, 70, 70, 80];
  const totalTableWidth = turtlesColumnWidths.reduce(
    (acc, width) => acc + width,
    0
  );
  const startX = (pageWidth - totalTableWidth) / 2;
  const startY = doc.y;

  const turtlesHeader = [
    "#",
    "Sexo",
    "Ancho",
    "Largo",
    "Ancho de plasta",
    "Largo de plasta",
    "Estado de salud",
    "Especie",
  ];
  const turtles = await getTurtlesInArray();

  drawTable(
    doc,
    [turtlesHeader, ...turtles],
    startX,
    startY,
    rowHeight,
    turtlesColumnWidths
  );
  doc.addPage();
  doc
    .fontSize(18)
    .fillColor("#132a13")
    .text("USUARIOS", { align: "center" })
    .moveDown(0.5);

  const usersHeader = [
    "ID",
    "Nombre",
    "Apellido Paterno",
    "Apellido Materno",
    "Email",
    "Usuario",
    "Rol",
  ];
  const users = await getUsersInArray();
  const usersColumnWidths = [30, 90, 90, 90, 120, 80, 90];
  const totalUsersTableWidth = usersColumnWidths.reduce(
    (acc, width) => acc + width,
    0
  );
  const usersStartX = (pageWidth - totalUsersTableWidth) / 2;
  const usersStartY = doc.y;

  drawTable(
    doc,
    [usersHeader, ...users],
    usersStartX,
    usersStartY,
    rowHeight,
    usersColumnWidths
  );

  doc.addPage();
  doc
    .fontSize(18)
    .fillColor("#132a13")
    .text("HISTORIALES MÉDICOS", { align: "center" })
    .moveDown(0.5);

  const medicalReportsHeader = [
    "Fecha",
    "Peso",
    "Diagnóstico",
    "Tratamiento",
    "Usuario"
  ];
  const medicalReportsColumnWidths = [70, 70, 100, 100, 150];
  const totalMedicalReportsTableWidth = medicalReportsColumnWidths.reduce(
    (acc, width) => acc + width,
    0
  );

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
      [medicalReportsHeader, ...medicalReports],
      startX,
      doc.y,
      rowHeight,
      medicalReportsColumnWidths
    );

    doc.moveDown(3);
  }

  doc.end();
}

module.exports = makeGeneralReport;
