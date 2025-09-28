"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const classificationList = document.querySelector("#classificationList");
  const inventoryDisplay = document.getElementById("inventoryDisplay");

  if (!classificationList || !inventoryDisplay) return;

  // Écoute le changement de classification
  classificationList.addEventListener("change", async () => {
    const classification_id = classificationList.value;

    // Si aucune classification n'est sélectionnée, vide le tableau
    if (!classification_id) {
      inventoryDisplay.innerHTML = "<tr><td colspan='3'>Please select a classification</td></tr>";
      return;
    }

    try {
      console.log(`Fetching vehicles for classification_id: ${classification_id}`);
      const response = await fetch(`/inv/getInventory/${classification_id}`);
      if (!response.ok) throw new Error("Network response was not OK");

      const data = await response.json();
      buildInventoryTable(data);
    } catch (error) {
      console.error("There was a problem fetching the inventory:", error);
      inventoryDisplay.innerHTML = `<tr><td colspan="3">Failed to load inventory data.</td></tr>`;
    }
  });

  // Fonction pour construire le tableau HTML des véhicules
  function buildInventoryTable(data) {
    if (!data || data.length === 0) {
      inventoryDisplay.innerHTML = "<tr><td colspan='3'>No vehicles found for this classification.</td></tr>";
      return;
    }

    let tableHTML = `
      <thead>
        <tr>
          <th>Vehicle Name</th>
          <th>Modify</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
    `;

    data.forEach((vehicle) => {
      tableHTML += `
        <tr>
          <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
          <td><a href="/inv/edit/${vehicle.inv_id}" title="Click to update">Modify</a></td>
          <td><a href="/inv/delete/${vehicle.inv_id}" title="Click to delete">Delete</a></td>
        </tr>
      `;
    });

    tableHTML += "</tbody>";
    inventoryDisplay.innerHTML = tableHTML;
  }
});
