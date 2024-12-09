function drawTable(doc, data, startX, startY, rowHeight, columnWidths) {
  const pageHeight = doc.page.height;
  const marginBottom = 50;
  let y = startY;

  data.forEach((row, rowIndex) => {
    if (y + rowHeight > pageHeight - marginBottom) {
      doc.addPage();
      y = 50;

      let headerX = startX;
      const header = data[0];
      header.forEach((cell, cellIndex) => {
        doc
          .rect(headerX, y, columnWidths[cellIndex], rowHeight)
          .fillAndStroke("#4CAF50", "#4CAF50");
        doc.fillColor("white").fontSize(9);
        doc.text(cell, headerX, y + 8, {
          width: columnWidths[cellIndex],
          align: "center",
        });
        headerX += columnWidths[cellIndex];
      });
      y += rowHeight;
    }

    let x = startX;
    row.forEach((cell, cellIndex) => {
      doc
        .rect(x, y, columnWidths[cellIndex], rowHeight)
        .fillAndStroke(rowIndex === 0 ? "#4CAF50" : "#F5F5F5", "black");
      doc
        .fillColor(rowIndex === 0 ? "white" : "black")
        .fontSize(rowIndex === 0 ? 9 : 8);

      doc.text(cell, x, y + 8, {
        width: columnWidths[cellIndex],
        align: "center",
      });

      x += columnWidths[cellIndex];
    });

    y += rowHeight;
  });
}

module.exports = drawTable;