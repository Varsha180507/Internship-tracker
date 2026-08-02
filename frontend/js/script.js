// Step 1: temporary in-memory storage (our "whiteboard")
let applications = [];

// Step 2: grab the form element by its id
const form = document.getElementById('tracker-form');

// Step 3: listen for the submit event
form.addEventListener('submit', function (event) {

  // Step 4a: stop the browser's default reload behavior
  event.preventDefault();

  // Step 4b: read current values from each field
  const company = document.getElementById('company').value;
  const role = document.getElementById('role').value;
  const status = document.getElementById('status').value;
  const dateApplied = document.getElementById('dateApplied').value;

  // Step 4c: build one object out of the 4 values
  const newApplication = {
    company: company,
    role: role,
    status: status,
    dateApplied: dateApplied
  };

  // Step 4d: push it into our array
  applications.push(newApplication);
  renderTable();

  // Step 4e: proof it worked
  console.log(applications);

});
function renderTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  applications.sort(function (a, b) {
  if (a.dateApplied < b.dateApplied) return -1;
  if (a.dateApplied > b.dateApplied) return 1;
  return 0;
});

    if (applications.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.textContent = "No applications yet — add your first one above!";
    emptyCell.setAttribute("colspan", "5");
    emptyCell.style.textAlign = "center";
    emptyCell.style.color = "#888";
    emptyCell.style.padding = "20px";
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
    return;
  }

  applications.forEach(function (app,index) {
    const row = document.createElement("tr");

    const companyCell = document.createElement("td");
    companyCell.textContent = app.company;
    row.appendChild(companyCell);

    const roleCell = document.createElement("td");
    roleCell.textContent = app.role;
    row.appendChild(roleCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = app.status;
    row.appendChild(statusCell);

    const dateCell = document.createElement("td");
    dateCell.textContent = app.dateApplied;
    row.appendChild(dateCell);

     // NEW: Delete button cell
    const actionCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-index", index);
    deleteBtn.addEventListener("click", function () {
      const idxToDelete = deleteBtn.getAttribute("data-index");
      applications.splice(idxToDelete, 1);
      renderTable();
    });
    actionCell.appendChild(deleteBtn);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}
renderTable();