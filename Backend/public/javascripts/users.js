/**
 * Função de visualização da password
 *
 * Altera o tipo do input da password para text e vice-versa
 *
 * @param {String} element
 */
function togglePasswordVisibility(element = "password") {
  var passwordInput = document.getElementById(element);
  var eyeIcon = document.getElementById("eye-icon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

/**
 * Função de visualização da confirmação de password
 *
 * Adiciona um element `<small>` com a mensagem de ajuda
 */
function passwordHelp() {
  var passwordHelpBlock = document.getElementById("passwordHelpBlock");
  var pass = document.getElementById("password");

  if (!passwordHelpBlock) {
    passwordHelpBlock = document.createElement("small");
    passwordHelpBlock.id = "passwordHelpBlock";
    passwordHelpBlock.className = "form-text text-muted";
    passwordHelpBlock.innerText = `     Deve conter no mínimo 8 caracteres
            Deve conter no máximo 16 caracteres
            Deve conter pelo menos uma letra maiúscula
            Deve conter pelo menos uma letra minúscula
            Deve conter pelo menos um número (0-9)
            Deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &)
          `;
    pass.parentNode.parentNode.appendChild(passwordHelpBlock);
  }
}

/**
 * Função de remoção da mensagem de ajuda
 *
 * Remove o element `<small>` com a mensagem de ajuda
 */
function passwordHelpRemove() {
  var passwordHelpBlock = document.getElementById("passwordHelpBlock");
  if (passwordHelpBlock) {
    passwordHelpBlock.remove();
  }
}

/**
 * Função de validação do nome
 *
 * Analisa a string do nome e verifica se contém apenas letras
 *
 * Regras:
 * - Deve conter apenas letras
 *
 * Padrão:
 * `/^(?:[A-Z][a-z]{2,}\s){1,5}[A-Z][a-z]{2,}$/`
 *
 * Fonte: https://www.w3resource.com/javascript/form/all-letters-field.php
 *
 * @param {HTMLElement} nameInput
 * @returns false and alert if not valid or true if valid
 */
function validateName(nameInput) {
  const regex = /^(?:[A-Z][a-z]{2,}\s){0,5}[A-Z][a-z]{2,}$/;

  if (!regex.test(nameInput.value)) {
    alert(
      "O nome deve conter:\n" +
      "  > no máximo 6 nomes\n" + 
      "  > no mínimo 3 letras\n" + 
      "  > letra maiúscula apenas no 1º caracter de cada nome\n"
    );
    return false;
  }

  return true;
}

/**
 * Função de validação do email
 * 
 * Verifica se o email é válido
 * 
 * Regras:
 * - Deve conter um @
 * - Deve conter um .
 * - Deve conter no mínimo 2 caracteres após o .
 * 
 * Padrão:
 * `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/`
 * 
 * Fonte: https://www.w3resource.com/javascript/form/email-validation.php
 * 
 * @param {HTMLElement} emailInput 
 * @returns false and alert if not valid or true if valid
 */
function validateEmail(emailInput) {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!regex.test(emailInput.value)) {
    alert("O email não é válido.");
    return false;
  }

  return true;
}

/**
 * Função de validação de password
 *
 * Verifica se a password e a confirmação de password são iguais
 * Verifica se a password e a confirmação de password correspondem a um padrão
 *
 * Regras:
 * - Deve conter no mínimo 8 caracteres
 * - Deve conter no máximo 16 caracteres
 * - Deve conter pelo menos uma letra maiúscula
 * - Deve conter pelo menos uma letra minúscula
 * - Deve conter pelo menos um número
 * - Deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &)
 *
 * Padrão:
 *  `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/`
 *
 * Fonte: https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
 *
 * @param {String} passwordInput
 * @param {String} confirmPasswordInput
 * @returns altert() com mensagem de erro e false ou true
 */
function validatePassword(passwordInput, confirmPasswordInput) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

  // check if passwords are not empty and match
  if (passwordInput.value !== confirmPasswordInput.value) {
    alert("A senha e a confirmação de senha não correspondem.");
    return false;
  }

  // check if password and is valid with regex
  if (
    !regex.test(passwordInput.value) &&
    !regex.test(confirmPasswordInput.value)
  ) {
    alert(
      "A password deve conter:\n  > no mínimo 8 caracteres\n  > no máximo 16 caracteres\n  > pelo menos uma letra maiúscula\n  > pelo menos uma letra minúscula\n  > pelo menos um número\n  > pelo menos um caractere especial (@, $, !, %, *, ?, &)"
    );
    return false;
  }

  return true;
}

/**
 * Função de validação do formulário
 *
 * Verifica o nome, email, password e confirmação de password
 *
 * @returns false ou form.submit()
 *
 * @see validateName()
 * @see validateEmail()
 * @see validatePassword()
 */
function validateForm(crud) {
  var form = document.getElementById("form");

  //validate name
  if (!validateName(document.getElementById("name"))) {
    return false;
  }

  //validate email
  if (!validateEmail(document.getElementById("email"))) {
    return false;
  }

  //validate password
  if (
    !document.getElementById("password").value &&
    !document.getElementById("confirm-password").value &&
    crud === "e"
  ) {
    // password e confirm password vazios
    // não faz alteração da password
  } else if (
    !validatePassword(
      document.getElementById("password"),
      document.getElementById("confirm-password")
    )
  ) {
    return false;
  }

  if (confirm("Tem a certeza que pretende gravar?")) {
    form.submit();
  } else {
    return false;
  }
}