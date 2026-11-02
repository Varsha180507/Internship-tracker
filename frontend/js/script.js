// Step 1: temporary in-memory storage (our "whiteboard")
let applications = [];
const API_URL = 'http://localhost:3000/applications';

async function loadApplications() {
  try {
    const response = await fetch(API_URL);
    applications = await response.json();
    renderTable();
  } catch (err) {
    console.log('Could not load applications:', err.message);
    showTableMessage('Cannot reach the server. Please try again in a moment.');
  }
}

// Step 2: grab the form element by its id
const form = document.getElementById('tracker-form');

// Step 3: listen for the submit event
form.addEventListener('submit',async function (event) {

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
     try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApplication)
    });
    if (!response.ok) {
      const err = await response.json();
      alert(err.error);
      return;
    }
    await loadApplications();
    form.reset();
  } catch (err) {
    console.log('Could not save application:', err.message);
    alert('Could not reach the server. Please try again.');
  }

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
    const statusSelect = document.createElement("select");
    ["Applied", "OA/Assessment", "Interview", "Offer", "Rejected"].forEach(function (option) {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      if (option === app.status) opt.selected = true;
      statusSelect.appendChild(opt);
    });
    statusSelect.addEventListener("change", async function () {
      try {
        const response = await fetch(API_URL + '/' + app._id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: statusSelect.value })
        });
        if (!response.ok) {
          const err = await response.json();
          alert(err.error);
        }
        await loadApplications();
      } catch (err) {
        console.log('Could not update:', err.message);
        alert('Could not reach the server. Please try again.');
      }
    });
    statusCell.appendChild(statusSelect);
    row.appendChild(statusCell);
    const dateCell = document.createElement("td");
    dateCell.textContent = app.dateApplied.slice(0,10);
    row.appendChild(dateCell);

     // NEW: Delete button cell
    const actionCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", async function () {
      try {
        const response = await fetch(API_URL + '/' + app._id, { method: 'DELETE' });
        if (!response.ok) {
          const err = await response.json();
          alert(err.error);
          return;
        }
        await loadApplications();
      } catch (err) {
        console.log('Could not delete:', err.message);
        alert('Could not reach the server. Please try again.');
      }
    });
    actionCell.appendChild(deleteBtn);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}
function showTableMessage(message) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.textContent = message;
  cell.setAttribute("colspan", "5");
  cell.style.textAlign = "center";
  cell.style.color = "#c0392b";
  cell.style.padding = "20px";
  row.appendChild(cell);
  tableBody.appendChild(row);
}
loadApplications();