import { TableManager } from "./table_manager.js";

const id = {
  name: "id",
  type: "number",
  label: "#",
  required: false,
  forSearch: true,
  editable: false,
};

const genre = {
  name: "genre",
  type: "select",
  label: "Sexo",
  required: true,
  forSearch: true,
  editable: true,
  options: async () => [
    { label: "MACHO", value: "Macho" },
    { label: "HEMBRA", value: "Hembra" },
  ],
  optionsType: "text",
  emptyOption: "Seleccione un sexo",
};

const width = {
  name: "width",
  type: "number",
  label: "Ancho",
  required: true,
  forSearch: false,
  editable: true,
};

const height = {
  name: "height",
  type: "number",
  label: "Largo",
  required: true,
  forSearch: false,
  editable: true,
};

const width_shell = {
  name: "width_shell",
  type: "number",
  label: "Ancho de Plasta",
  required: true,
  forSearch: false,
  editable: true,
};

const height_shell = {
  name: "height_shell",
  type: "number",
  label: "Largo de Plasta",
  required: true,
  forSearch: false,
  editable: true,
};

const health_status = {
  name: "health_status",
  type: "select",
  label: "Estado de Salud",
  required: true,
  forSearch: true,
  editable: true,
  options: async () => [
    { label: "SANA", value: "SANA" },
    { label: "ENFERMA", value: "ENFERMA" },
  ],
  optionsType: "text",
  emptyOption: "Seleccione un estado de salud",
};

const species = {
  name: "id_species",
  type: "select",
  label: "Especie",
  required: true,
  forSearch: true,
  editable: true,
  options: async () => {
    const response = await fetch("/api/v1/turtles/species");
    const { species } = await response.json();
    return species.map((specie) => ({ value: specie.id, label: specie.name }));
  },
  optionsType: "number",
  emptyOption: "Seleccione una especie",
};

const turtleFields = [
  id,
  genre,
  width,
  height,
  width_shell,
  height_shell,
  health_status,
  species,
];
const turtleManager = new TableManager("Tortugas Registradas", turtleFields);

turtleManager.SetOnCreateHandler(async (record) => {
  const response = await fetch("/api/v1/turtles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  });
  const { message, turtle, error } = await response.json();
  if (error) {  
    throw new Error(error);
  }
  return {message, record: turtle};
});

turtleManager.SetOnSearchHandler(async (filters) => {
  const response = await fetch("/api/v1/turtles?" + new URLSearchParams(filters));
  const { turtles, message, error } = await response.json();
  if (error) {  
    throw new Error(error);
  }
  return { message, records: turtles };
});

turtleManager.SetOnDeleteHandler(async (record) => {
  const response = await fetch(`/api/v1/turtles/${record.id}`, {
    method: "DELETE",
  });
  const { message, error } = await response.json();
  if (error) {  
    throw new Error(error);
  }
  return { message };
});

turtleManager.SetOnUpdateHandler(async (record, newData) => {
  const response = await fetch(`/api/v1/turtles/${record.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  });
  const { message, turtle, error } = await response.json();
  if (error) {  
    throw new Error(error);
  }
  return { message, record: turtle };
});

document.addEventListener("DOMContentLoaded", async () => {
  await turtleManager.Render();

  const respone = await fetch("/api/v1/turtles");
  const { turtles } = await respone.json();
  turtleManager.AppendRecords(...turtles);
});
