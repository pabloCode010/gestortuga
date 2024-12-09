const { makeUsersReport } = require("../reports/make_users_report.js");
const { makeTurtlesReport } = require("../reports/make_turtles_report.js");
const { makeMedicalRecordsReport } = require("../reports/make_medical_records_report.js");
const makeGeneralReport = require("../reports/make_general_report.js");

async function sendReport(req, res, next) {
  try {
    const report = req.params.report;
    res.setHeader("Content-Type", "application/pdf");

    switch (report) {
      case "turtles":
        makeTurtlesReport(res);
        break;
      case "users":
        makeUsersReport(res);
        break;
      case "general":
        makeGeneralReport(res);
        break;
      case "medical_records":
        makeMedicalRecordsReport(res);
        break;
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendReport,
};
