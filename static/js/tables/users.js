import { TableManager } from "./table_manager.js";

const id = {
  name: "id",
  type: "number",
  label: "#",
  required: false,
  forSearch: true,
  editable: false,
};

const name = {
  name: "name",
  type: "text",
  label: "Nombre",
  required: true,
  forSearch: true,
  editable: true,
};

const last_name_pat = {
  name: "last_name_pat",
  type: "text",
  label: "Apellido Paterno",
  required: false,
  forSearch: false,
  editable: true,
};

const last_name_mat = {
  name: "last_name_mat",
  type: "text",
  label: "Apellido Materno",
  required: false,
  forSearch: false,
  editable: true,
};

const email = {
  name: "email",
  type: "email",
  label: "Correo Electrónico",
  required: true,
  forSearch: true,
  editable: true,
};

const username = {
  name: "username",
  type: "text",
  label: "Username",
  required: true,
  forSearch: true,
  editable: true,
};

const password = {
  name: "password",
  type: "text",
  label: "Contraseña",
  required: true,
  editable: true,
  forSearch: false,
};

const role = {
  name: "id_role",
  type: "select",
  label: "Rol",
  required: true,
  forSearch: true,
  editable: true,
  options: async () => {
    const response = await fetch("/api/v1/users/roles");
    const { roles } = await response.json();
    return roles.map((role) => ({ value: role.id, label: role.name }));
  },
  optionsType: "number",
  emptyOption: "Seleccione un rol",
};

const usersFields = [id, name, last_name_pat, last_name_mat, email, username, password, role];
const usersManager = new TableManager("Usuarios Registrados", usersFields);

usersManager.SetOnCreateHandler(async (data) => {
  const response = await fetch("/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const { user, error, message } = await response.json();

  if (error) {  
    throw new Error(error);
  }

  return { message, record: user };
});

usersManager.SetOnSearchHandler(async (filters) => {
  const searchParams = new URLSearchParams(filters).toString();  
  const response = await fetch(`/api/v1/users?${searchParams}`);
  const { users, error, message } = await response.json();

  if (error) {
    throw new Error(error);
  }

  return { message, records: users };
});

usersManager.SetOnUpdateHandler(async (record, newData) => {   
  const response = await fetch(`/api/v1/users/${record.id}?new_password=${record.password !== newData.password}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  });

  const { user, error, message } = await response.json();

  if (error) {
    throw new Error(error);
  }

  return { message, record: user };
});

usersManager.SetOnDeleteHandler(async (record) => {
  const response = await fetch(`/api/v1/users/${record.id}`, {
    method: "DELETE",
  });

  const { error, message } = await response.json();

  if (error) {
    throw new Error(error);
  }

  return { message, record };
});


document.addEventListener("DOMContentLoaded", async () => {
  await usersManager.Render();

  const respone = await fetch("/api/v1/users")
  const { users } = await respone.json();
  usersManager.AppendRecords(...users);
});
