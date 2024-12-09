const alertBox = document.createElement("div");
alertBox.classList.add("alert-box");
document.body.appendChild(alertBox);

export function alertError(message) {
  alertEvent(message, "error");
}

export function alertSuccess(message) {
  alertEvent(message, "success");
}

function alertEvent(message, type) {
  const alertMessage = document.createElement("p");

  alertMessage.classList.add("message", type);
  alertMessage.textContent = message;
  alertBox.appendChild(alertMessage);

  if (!alertBox.classList.contains("show")) {
    alertBox.classList.add("show");
  }

  setTimeout(() => {
    alertMessage.remove();

    if (alertBox.children.length === 0) {
      alertBox.classList.remove("show");
    }
  }, 3000);
}
