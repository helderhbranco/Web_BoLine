function iconStatus(type) {
  // Seletor para localizar todas as células de status
  const statusCells = document.querySelectorAll("#status-cell");

  // Iterar sobre cada célula de status
  statusCells.forEach(function (cell) {
    const status = cell.textContent.trim();

    // Criar um elemento SVG para o ícone
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    icon.setAttribute("width", "16");
    icon.setAttribute("height", "16");
    icon.setAttribute("fill", "currentColor");
    icon.setAttribute("class", "bi bi-circle-fill");

    // Criar um elemento de círculo dentro do ícone SVG
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", "8");
    circle.setAttribute("cy", "8");
    circle.setAttribute("r", "8");

    if (type === "user") {
      // Definir a classe de cor apropriada com base no status
      if (status === "true") {
        circle.setAttribute("class", "text-success");
      } else if (status === "false") {
        circle.setAttribute("class", "text-danger");
      }
    } else if (type === "monument") {
      if (status === "Activated") {
        circle.setAttribute("class", "text-success");
      } else if (status === "Deactivated") {
        circle.setAttribute("class", "text-danger");
      }
    }

    // Adicionar o elemento de círculo ao ícone SVG
    icon.appendChild(circle);

    // Limpar o conteúdo da célula e adicionar o ícone
    cell.innerHTML = "";
    cell.appendChild(icon);
  });
}
