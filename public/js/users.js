"use strict";

// Get a list of users
let classificationList = document.querySelector("#classificationList");
document.addEventListener("DOMContentLoaded", function () {
  let usersURL = "/users/get-users";
  fetch(usersURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data);
      buildUsersList(data);
    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
});

// Build users items into HTML table components and inject into DOM
function buildUsersList(data) {
  let usersDisplay = document.getElementById("usersDisplay");
  // Set up the table labels
  let dataTable = "<thead>";
  dataTable += "<tr><th>User Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
  dataTable += "</thead>";
  // Set up the table body
  dataTable += "<tbody>";
  // Iterate over all users in the array and put each in a row
  data.forEach(function (element) {
    console.log(element.account_id + ", " + element.account_firstname + ", " + element.account_lastname);
    dataTable += `<tr><td>${element.account_firstname} ${element.account_lastname}</td>`;
    dataTable += `<td><a href='/users/update/${element.account_id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/users/delete/${element.account_id}' title='Click to delete'>Delete</a></td></tr>`;
  });
  dataTable += "</tbody>";
  // Display the contents in the users Management view
  usersDisplay.innerHTML = dataTable;
}
