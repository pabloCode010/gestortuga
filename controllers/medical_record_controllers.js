const medicalRecordServices = require('../services/medical_record_services.js');

async function createMedicalRecord(req, res, next) {
  try {    
    const newMedicalRecord = await medicalRecordServices.createMedicalRecord({ ...req.body, id_user: req.user.id });
    res.json({
      message: 'Historial médico creado exitosamente',
      medicalRecord: newMedicalRecord
    });
  } catch (error) {
    next(error);
  }
}

async function getMedicalRecords(req, res, next) {
  try {
    const medicalRecords = await medicalRecordServices.getMedicalRecords(req.query);
    res.json({
      message: `Se encontraron ${medicalRecords.length} historiales médicos`,
      medicalRecords
    });
  } catch (error) {
    next(error);
  }
}

async function deleteMedicalRecord(req, res, next) {
  try {
    await medicalRecordServices.deleteMedicalRecordById(req.params.id);
    res.json({
      message: 'Historial médico eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
}

async function updateMedicalRecord(req, res, next) {
  try {
    const updatedMedicalRecord = await medicalRecordServices.updateMedicalRecordById(req.params.id, req.body);
    res.json({
      message: 'Historial médico actualizado exitosamente',
      medicalRecord: updatedMedicalRecord
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createMedicalRecord,
  getMedicalRecords,
  deleteMedicalRecord,
  updateMedicalRecord
};
