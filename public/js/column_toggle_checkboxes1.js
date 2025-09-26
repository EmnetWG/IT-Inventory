
// ✅ 1. Dynamically generate checkboxes for all 20 columns
document.addEventListener("DOMContentLoaded", () => {
  const columnNames = [
    "Location", "Floor", "Item Type", "Category", "Manufacturer", "Model", "RAM",
    "CPU Speed", "HD Size", "OS", "Serial Number", "Status", "Toner", "Size",
    "Copy Speed", "Port Count", "Is Managed", "Resolution", "Storage Type", "Firmware"
  ];

  const container = document.getElementById("columnToggleContainer");
  columnNames.forEach((name, index) => {
    const label = document.createElement("label");
    label.style.marginRight = "12px";
    label.innerHTML = `
      <input type="checkbox" class="column-toggle" data-col="${index}" checked> ${name}
    `;
    container.appendChild(label);
  });

  // ✅ 2. Bind toggle logic to checkboxes
  container.addEventListener("change", (e) => {
    if (!e.target.classList.contains("column-toggle")) return;

    const colIndex = parseInt(e.target.dataset.col, 10);
    const show = e.target.checked;

    const allRows = document.querySelectorAll("#itemsTable tr");
    allRows.forEach(row => {
      const cells = row.children;
      if (cells[colIndex]) {
        cells[colIndex].style.display = show ? "" : "none";
      }
    });
  });
});
