function errorStyle(input, msg, text) {
  let eInput = document.getElementById(input);
  let eMsg = document.getElementById(msg);

  eInput.style.border = "1px solid red";
  eMsg.style.color = "red";
  eMsg.style.display = "block";
  eMsg.innerText = text;

  if (input === "email") {
    let eInput2 = document.getElementById("confirm-email");
    eInput2.style.border = "1px solid red";
  }

  if (input === "password") {
    let eInput2 = document.getElementById("confirm-password");
    eInput2.style.border = "1px solid red";
  }
}

function successStyle(input, msg) {
  let eInput = document.getElementById(input);
  let eMsg = document.getElementById(msg);

  eInput.style.border = "1px solid green";
  eMsg.style.display = "none";

  if (input === "email") {
    let eInput2 = document.getElementById("confirm-email");
    eInput2.style.border = "1px solid green";
  }

  if (input === "password") {
    let eInput2 = document.getElementById("confirm-password");
    eInput2.style.border = "1px solid green";
  }
}

function verifyFormRegister() {
  if (!validateName(document.getElementById("name"))) {
    errorStyle("name", "name-message", "Nome inválido");
    return false;
  } else {
    successStyle("name", "name-message");
  }

  if (!validateEmail(document.getElementById("email")) || !validateEmail(document.getElementById("confirm-email"))) {
    errorStyle("email", "email-message", "Email ou confirmação inválido(s)");
    return false;
  } else {
    successStyle("email", "email-message");
  }

  if (
    !validatePassword(
      document.getElementById("password"),
      document.getElementById("confirm-password")
    )
  ) {
    errorStyle("password", "password-message", "Password ou confirmação inválida(s)");
    return false;
  } else {
    successStyle("password", "password-message");
  }

  document.getElementById("form").submit();
}

function verifyFormLogin() {

  if (!validateEmail(document.getElementById("email"))) {
    errorStyle("email", "email-message", "Email inválido");
    return false;

  }

  return true;
}