import { alertError, alertSuccess } from "../alerts/alerts.js";

/*
field structure = {
  name: string,
  type: string,
  label: string,
  required: boolean,
  forSearch: boolean,
  editable: boolean,
  options: async () => [{label: string, value: string}]>
  optionsType: string,
}
*/

export class TableManager {
  constructor(name, fields) {
    this.name = name;
    this.fields = fields;
    this.containerElement = null;
    this.managerElement = null;
    this.gobackButton = null;
    this.titleElement = null;
    this.searchForm = null;
    this.createForm = null;
    this.tableContainer = null;
    this.table = null;

    // crud handlers
    this.onCreate = null;
    this.onSearch = null;
    this.onUpdate = null;
    this.onDelete = null;

    // bind methods
    this.HandleCreateFormSubmit = this.HandleCreateFormSubmit.bind(this);
    this.HandleSearchFormSubmit = this.HandleSearchFormSubmit.bind(this);
    this.HandleUpdateRecord = this.HandleUpdateRecord.bind(this);
    this.HandleDeleteRecord = this.HandleDeleteRecord.bind(this);
  }

  async Build() {
    this.containerElement = document.createElement("div");
    this.containerElement.classList.add("manager-container");

    this.managerElement = document.createElement("div");
    this.managerElement.classList.add("manager");

    // load options for select fields
    await this.LoadFieldOptions(this.fields);
    this.BuildGobackButton();
    this.BuildTitleElement();
    this.BuildSearchForm();
    this.BuildCreateForm();
    this.BuildTable();
  }

  async Render() {
    await this.Build();
    this.managerElement.appendChild(this.gobackButton);
    this.managerElement.appendChild(this.titleElement);
    this.managerElement.appendChild(this.searchForm);
    this.managerElement.appendChild(this.createForm);
    this.managerElement.appendChild(this.tableContainer);
    this.containerElement.appendChild(this.managerElement);

    document.body.appendChild(this.containerElement);
  }

  BuildGobackButton() {
    const gobackButton = document.createElement("a");
    gobackButton.classList.add("goback-button");
    gobackButton.innerHTML = `
      <span class="material-symbols-outlined">
        arrow_back
      </span>
      Volver`;
    gobackButton.href = "/admin";
    
    this.gobackButton = gobackButton;
  }

  BuildTitleElement() {
    const titleElement = document.createElement("h1");
    titleElement.classList.add("manager-title");
    titleElement.textContent = this.name;

    this.titleElement = titleElement;
  }

  BuildSearchForm() {
    const searchForm = document.createElement("form");
    searchForm.classList.add("search-form");

    // filter fields for search
    this.fields
      .filter((field) => field.forSearch)
      .forEach((field) => {
        if (field.type === "select") {
          const options = [
            { label: field.emptyOption, value: "" },
            ...field.options,
          ]; // add empty option to search
          field = { ...field, options };
        }

        searchForm.appendChild(
          this.CreateFieldElement({ ...field, required: false, editable: true })
        ); // all fields are editable and not required for search
      });

    const searchButton = this.CreateIconButtonElement("button", "search");
    searchForm.appendChild(searchButton);

    this.searchForm = searchForm;
    searchForm.addEventListener("submit", this.HandleSearchFormSubmit);
  }

  BuildCreateForm() {
    const createForm = document.createElement("form");
    createForm.classList.add("create-form");

    // filter fields for create a new record, only editable fields
    this.fields
      .filter((field) => field.editable)
      .forEach((field) => {
        createForm.appendChild(this.CreateFieldElement(field));
      });

    const submitButton = this.CreateButtonElement("button", "Añadir");
    submitButton.type = "submit";
    createForm.appendChild(submitButton);

    this.createForm = createForm;
    createForm.addEventListener("submit", this.HandleCreateFormSubmit);
  }

  BuildTable() {
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("table-container");

    const table = document.createElement("table");
    table.classList.add("table");

    const thead = document.createElement("thead");
    thead.innerHTML = `
          <tr>
              ${this.fields
                .map((field) => `<th>${field.label}</th>`)
                .join("\n")}
              <th>Opciones</th>
          </tr>
      `;

    const tbody = document.createElement("tbody");
    tbody.classList.add("table-data");

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);

    this.tableContainer = tableContainer;
    this.table = table;
  }

  async LoadFieldOptions(fields) {
    try {
      const fieldsWithOptions = fields
        .filter((field) => field.type === "select")
        .map(async (field) => {
          field.options = await field.options(); // load options from async function
          return field;
        });

      await Promise.all(fieldsWithOptions); // wait for all fields with options
    } catch (error) {
      alertError(error.message);
    }
  }

  // field = {name, type, label, required, editable, options}
  CreateFieldElement(field) {
    let fieldElement;

    switch (field.type) {
      case "select":
        fieldElement = this.CreateSelectElement(field);
        break;

      default:
        fieldElement = this.CreateInputElement(field);
        break;
    }

    fieldElement.classList.add("field");
    return fieldElement;
  }

  CreateSelectElement(field) {
    const selectElement = document.createElement("select");
    selectElement.name = field.name;

    field.options.forEach((option) => {
      const optionElement = this.CreateOptionElement(option);
      selectElement.appendChild(optionElement);
    });

    return selectElement;
  }

  CreateInputElement(field) {
    const inputElement = document.createElement("input");
    inputElement.type = field.type;
    inputElement.name = field.name;
    inputElement.placeholder = field.label;
    inputElement.required = field.required;
    inputElement.disabled = !field.editable;
    inputElement.step = 0.01;

    return inputElement;
  }

  CreateOptionElement(option) {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.label;

    return optionElement;
  }

  CreateButtonElement(className, text) {
    const button = document.createElement("button");
    button.classList.add(className);
    button.textContent = text;

    return button;
  }

  CreateIconButtonElement(className, icon) {
    const button = document.createElement("button");
    button.classList.add(className);
    button.innerHTML = `<span class="material-symbols-outlined">${icon}</span>`;

    return button;
  }

  // create a table row element with record data
  CreateTableRowElement(record) {
    const tr = document.createElement("tr");
    tr.classList.add(`record-${record.id}`);

    this.fields.forEach((field) => {
      const td = document.createElement("td");
      td.textContent = record[field.name];

      if (field.type === "select") {
        const option = field.options.find((option) => option.value === record[field.name]);
        td.textContent = option ? option.label : "";
      }

      tr.appendChild(td); 
    });

    const td = document.createElement("td");
    const buttonsGroup = document.createElement("div");
    buttonsGroup.classList.add("buttons-group");

    const editButton = this.CreateIconButtonElement("record-action-button", "edit");
    buttonsGroup.appendChild(editButton);

    const deleteButton = this.CreateIconButtonElement("record-action-button", "delete");
    buttonsGroup.appendChild(deleteButton);

    editButton.addEventListener("click", () => this.EnableRecordEdition(record));
    deleteButton.addEventListener("click", () => this.HandleDeleteRecord(record));

    td.appendChild(buttonsGroup);
    tr.appendChild(td);

    return tr;
  }

  // enable edition for a record in the table, transform td to input fields
  EnableRecordEdition(record) {
    const tr = this.table.querySelector(`.record-${record.id}`);
    const tds = tr.querySelectorAll("td");

    this.fields.forEach((field, index) => {
      const td = tds[index];
      const fieldElement = this.CreateFieldElement(field);
      fieldElement.value = record[field.name];
      td.innerHTML = "";
      td.appendChild(fieldElement);
    });

    // td for buttons save and cancel
    const td = tds[tds.length - 1];
    td.innerHTML = "";

    const buttons = document.createElement("div");
    buttons.classList.add("buttons-group");

    const saveButton = this.CreateIconButtonElement("record-action-button", "save");
    buttons.appendChild(saveButton);

    const cancelButton = this.CreateIconButtonElement("record-action-button", "cancel");
    buttons.appendChild(cancelButton);

    saveButton.addEventListener("click", () => this.HandleUpdateRecord(record));
    cancelButton.addEventListener("click", () => this.CancelRecordEdition(record));

    td.appendChild(buttons);
  }

  // delete a row element from the table
  DeleteTableRowElement(record) {
    const tr = this.table.querySelector(`.record-${record.id}`);
    tr.remove();
  }

  // update a row element in the table
  UpdateTableRowElement(record) {
    const tr = this.table.querySelector(`.record-${record.id}`);
    const updatedTr = this.CreateTableRowElement(record);
    tr.replaceWith(updatedTr);
  }

  // cancel edition for a record in the table, transform input fields to td
  CancelRecordEdition(record) {
    const currentRowElement = this.table.querySelector(`.record-${record.id}`);
    const originalRowElement = this.CreateTableRowElement(record);
    currentRowElement.replaceWith(originalRowElement);
  }

  // append records to the table
  AppendRecords(...records) {
    const tableBody = this.table.querySelector("tbody");

    records.forEach((record) => {
      const tableRowElement = this.CreateTableRowElement(record);
      tableBody.appendChild(tableRowElement);
    });
  }

  // collect updated record data from input fields
  CollectUpdatedRecordData(record) {
    const tr = this.table.querySelector(`.record-${record.id}`);
    const tds = tr.querySelectorAll("td");

    const data = {};
    this.fields.forEach((field, index) => {
      const td = tds[index];
      const fieldElement = td.querySelector(".field");
      let value = fieldElement.value;

      // convert number fields to number type
      if (field.type === "number"  || (field.type === "select" && field.optionsType === "number")) {
        value = Number(value);
      }

      data[field.name] = value;
    });
    
    return data;
  }

  // event handlers
  async HandleSearchFormSubmit(e) {
    try {
      e.preventDefault();
      const formData = new FormData(this.searchForm);
      const filters = Object.fromEntries(formData.entries());
      const { message, records } = await this.onSearch(filters);
      alertSuccess(message);
      this.table.querySelector("tbody").innerHTML = "";
      this.AppendRecords(...records);
    } catch (error) {
      alertError(error.message);
    }
  }

  async HandleCreateFormSubmit(e) {
    try {
      e.preventDefault();
      const formData = new FormData(this.createForm);
      const record = Object.fromEntries(formData.entries());

      // convert number fields to number type
      this.fields.forEach((field) => {
        if (field.type === "number"  || (field.type === "select" && field.optionsType === "number")) {
          record[field.name] = Number(record[field.name]);
        }
      });
      
      const { message, record: newRecord } = await this.onCreate(record);
      alertSuccess(message);
      this.createForm.reset();
      this.AppendRecords(newRecord);
    } catch (error) {
      alertError(error.message);
    }
  }

  async HandleUpdateRecord(record) {
    try {
      const updatedRecordData = this.CollectUpdatedRecordData(record);
      const { message, record: updatedRecord } = await this.onUpdate(record, updatedRecordData);
      alertSuccess(message);
      this.UpdateTableRowElement(updatedRecord);
    } catch (error) {
      alertError(error.message);
    }
  }

  async HandleDeleteRecord(record) {
    try {
      if (!confirm("¿Estás seguro de eliminar este registro?")) {
        return;
      }

      const { message } = await this.onDelete(record);
      alertSuccess(message);
      this.DeleteTableRowElement(record);
    } catch (error) {
      alertError(error.message);
    }
  }

  SetOnSearchHandler(handler) {
    this.onSearch = handler;
  }

  SetOnCreateHandler(handler) {
    this.onCreate = handler;
  }

  SetOnUpdateHandler(handler) {
    this.onUpdate = handler;
  }

  SetOnDeleteHandler(handler) {
    this.onDelete = handler;
  }
}
