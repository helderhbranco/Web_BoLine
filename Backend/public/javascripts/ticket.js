const User = require("../../models/User");

async function formNewUser() {
  var select = document.getElementById("users");
  var option = select.options[select.selectedIndex].value;
  var selectedUserEmail = document.getElementById("auxiliar");

  if (option == "new") {
    console.log("new");
    document.getElementById("new-user").style.display = "block";
    selectedUserEmail.textContent = "Indique os dados do novo utilizador";
  }
}
