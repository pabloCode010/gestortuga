import { TableManager } from "./table_manager.js";

const id = {
  name: "id",
  type: "number",
  label: "#",
  required: false,
  forSearch: true,
  editable: false,
};

const date = {
  name: "date",
  type: "date",
  label: "Fecha",
  required: true,
  forSearch: true,
  editable: true,
};

const weight = {
  name: "weight",
  type: "number",
  label: "Peso (kg)",
  required: true,
  forSearch: false,
  editable: true,
};

const diagnosis = {
  name: "diagnosis",
  type: "text",
  label: "Diagnóstico",
  required: true,
  forSearch: false,
  editable: true,
};

const treatment = {
  name: "treatment",
  type: "text",
  label: "Tratamiento",
  required: true,
  forSearch: false,
  editable: true,
};

const turtle_id = {
  name: "id_turtle",
  type: "select",
  label: "# Tortuga",
  required: true,
  forSearch: true,
  editable: true,
  options: async () => {
    const response = await fetch("/api/v1/turtles");
    const { turtles } = await response.json();
    return turtles.map((turtle) => ({ value: turtle.id, label: `#${turtle.id}` }));
  },
  optionsType: "number",
  emptyOption: "Seleccione una tortuga",
};

const id_user = {
  name: "id_user",
  type: "select",
  label: "Usuario",
  required: false,
  forSearch: true,
  editable: false,
  options: async () => {
    const response = await fetch("/api/v1/users");
    const { users } = await response.json();
    return users.map((user) => ({ value: user.id, label: `${user.name} ${user.last_name_pat} ${user.last_name_mat}` }));
  },
  optionsType: "number",
  emptyOption: "Seleccione un usuario",
};

const medicalRecordFields = [
  id,
  date,
  weight,
  diagnosis,
  treatment,
  turtle_id,
  id_user,
];

const medicalRecordsManager = new TableManager("Historiales Médicos", medicalRecordFields);

medicalRecordsManager.SetOnCreateHandler(async (data) => {
  const response = await fetch("/api/v1/medical_records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const { medicalRecord, message, error } = await response.json();
  if (error) {  
    throw new Error(error);
  }
  medicalRecord.date = medicalRecord.date.slice(0, 10);
  return { message, record: medicalRecord };
});

medicalRecordsManager.SetOnDeleteHandler(async (record) => {
  const response = await fetch(`/api/v1/medical_records/${record.id}`, {
    method: "DELETE",
  });
  const { message, error } = await response.json();
  if (error) {  
    throw new Error(error);
  }
  return { message };
});

medicalRecordsManager.SetOnUpdateHandler(async (record, newData) => {
  console.log(record, newData);
  
  const response = await fetch(`/api/v1/medical_records/${record.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  });
  const { medicalRecord, message, error } = await response.json();
  if (error) {  
    throw new Error(error);
  }
  medicalRecord.date = medicalRecord.date.slice(0, 10);
  return { message, record: medicalRecord };
});

medicalRecordsManager.SetOnSearchHandler(async (filters) => {
  const searchParams = new URLSearchParams(filters).toString();  
  const response = await fetch(`/api/v1/medical_records?${searchParams}`);
  const { medicalRecords, message, error } = await response.json();
  if (error) {  
    throw new Error(error);
  }
  medicalRecords.forEach((medicalRecord) => {
    medicalRecord.date = medicalRecord.date.slice(0, 10);
  });
  return { message, records: medicalRecords };
});

document.addEventListener("DOMContentLoaded", async () => {
  await medicalRecordsManager.Render();

  const response = await fetch("/api/v1/medical_records");
  const { medicalRecords } = await response.json();

  medicalRecords.forEach((medicalRecord) => {
    medicalRecord.date = medicalRecord.date.slice(0, 10);
  });
  medicalRecordsManager.AppendRecords(...medicalRecords);
});
