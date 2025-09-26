


let currentPage = 1;
const limit = 20;

async function fetchItems(page = 1) {
  
const offset = (page - 1) * limit;
currentPage = page;

try {
  const res = await fetch(`/api/items?limit=${limit}&offset=${offset}`);
//console.log('✅ Fetched response:', res);
  const data = await res.json();
 // console.log(data)
 if (!Array.isArray(data.items)) {
      console.error('API returned invalid items:', data.items);
      return;
 }
  renderTable(data.items);
  renderPagination(data.total);
  applyFilters();
 // saveToLocal(data.items); // optional
} catch (err) {
  console.error('Failed to fetch paginated items:', err);
}
}

function renderTable(items) {
   if (!Array.isArray(items)) {
    console.error('renderTable received invalid items:', items);
    return;
  }
const tableBody = document.querySelector('#itemsTable tbody');
tableBody.innerHTML = '';

items.forEach(item => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${item.location}</td>
    <td>${item.floor}</td>
    <td data-item-type-id="${item.listItemType?.itemid || ''}">${ item.listItemType?.itemName || ''}</td>
     <td>${item.category || ''}</td>
    <td>${item.manufacturer || ''}</td>
    <td>${item.model || ''}</td>
    <td>${item.ram || ''}</td>
   
    <td>${item.cpuSpeed ? item.cpuSpeed + ' GHz' : ''}</td>

    <td>${item.hdSize ? item.hdSize + ' GB' : ''}</td>
    <td>${item.operatingSystem || ''}</td>
    <td>${item.serialNumber}</td>
     <td>${item.status || ''}</td>
     <td>${item.toner || ''}</td>
      <td>${item.size || ''}</td>
      <td>${item.copySpeed || ''}</td>
       <td>${item.portCount || ''}</td>
        <td>${item.isManaged || ''}</td>
         <td>${item.resolution || ''}</td>
          <td>${item.storageType || ''}</td>
           <td>${item.firmwareVersion || ''}</td>
    
  `;
  tableBody.appendChild(row);
});


}

function renderPagination(totalItems) {
const totalPages = Math.ceil(totalItems / limit);
const container = document.getElementById('pagination');
container.innerHTML = '';

for (let page = 1; page <= totalPages; page++) {
  const btn = document.createElement('button');
  btn.textContent = page;
  btn.className = (page === currentPage) ? 'active' : '';
  btn.onclick = () => fetchItems(page);
  container.appendChild(btn);
}
}


// Load on page ready
document.addEventListener('DOMContentLoaded', () => {
  fetchItems(); // Load table data on page load

  // Attach filter listeners
  document.getElementById("filterFloor").addEventListener("input", applyFilters);
  document.getElementById("filterLocation").addEventListener("input", applyFilters);
  document.getElementById("filterItemType").addEventListener("change", applyFilters);
});




// search 

document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const rows = document.querySelectorAll("#itemsTable tbody tr");
  const typeCounts = {};

  rows.forEach(row => {
    const rowText = row.textContent.toLowerCase();
    const rowItemType = row.children[2].textContent;

    const match = rowText.includes(searchTerm);

    if (match) {
      row.style.display = "";
      typeCounts[rowItemType] = (typeCounts[rowItemType] || 0) + 1;
    } else {
      row.style.display = "none";
    }
  });

  // Update item type 


const breakdownDiv = document.getElementById("itemTypeBreakdown");
breakdownDiv.innerHTML = ''; // Clear previous cards

if (Object.keys(typeCounts).length === 0) {
  breakdownDiv.innerHTML = `<div class="col-12"><div class="alert alert-warning">No items to display.</div></div>`;
  return;
}

Object.entries(typeCounts).forEach(([type, count]) => {
  const card = document.createElement('div');
  card.className = 'col-md-3 mb-3';

  card.innerHTML = `
    <div class="card text-white bg-primary h-100 shadow-sm">
      <div class="card-body d-flex flex-column justify-content-center align-items-center">
        <h5 class="card-title">${type}</h5>
        <p class="card-text display-6">${count}</p>
      </div>
    </div>
  `;

  breakdownDiv.appendChild(card);
});

  });






document.addEventListener('DOMContentLoaded', () => fetchItems());

document.addEventListener('DOMContentLoaded', async () => {
  const openBtn = document.getElementById('openFormModalBtn');
  const modal = document.getElementById('formModal');
  const closeBtn = document.getElementById('closeFormModal');
  const filterSelect = document.getElementById('filterItemType');
  await loadItemTypesIntoSelect(filterSelect);
  /*
 
  

  

  */

  
  });

  


/*


*/
function applyFilters() {
  const floor = document.getElementById("filterFloor").value.toLowerCase();
  const location = document.getElementById("filterLocation").value.toLowerCase();
  const itemType = document.getElementById("filterItemType").value;

  const rows = document.querySelectorAll("#itemsTable tbody tr");
  const typeCounts = {};

  rows.forEach(row => {
    const rowLocation = row.children[0].textContent.toLowerCase() || "";
    const rowFloor = row.children[1].textContent.toLowerCase() || "";
  //  const rowItemType = row.children[2].textContent.toLowerCase() || "";
  const itemTypeCell = row.children[2];
    const rowItemTypeId = itemTypeCell.getAttribute("data-item-type-id") || "";

    const match =
      (floor === "" || rowFloor.includes(floor)) &&
      (location === "" || rowLocation.includes(location)) &&
     // (itemType === "" || rowItemType.toLowerCase().includes(itemType));
     (itemType === "" || rowItemTypeId === itemType);
console.log('Row item type:', rowItemTypeId, '| Filter:', itemType);

    if (match) {
      row.style.display = "";
     // typeCounts[rowItemType] = (typeCounts[rowItemType] || 0) + 1;
     const typeLabel = itemTypeCell.textContent || 'Unknown';
      //const typeLabel = row.children[2]?.textContent || 'Unknown';
      typeCounts[typeLabel] = (typeCounts[typeLabel] || 0) + 1;
    } else {
      row.style.display = "none";
    }
  });

  // Display grouped counts only


  const breakdownDiv = document.getElementById("itemTypeBreakdown");
breakdownDiv.innerHTML = ''; // Clear previous cards

if (Object.keys(typeCounts).length === 0) {
  breakdownDiv.innerHTML = `<div class="col-12"><div class="alert alert-warning">No items to display.</div></div>`;
  return;
}

Object.entries(typeCounts).forEach(([type, count]) => {
  const card = document.createElement('div');
  card.className = 'col-md-3 mb-3';

  card.innerHTML = `
    <div class="card text-white bg-primary h-100 shadow-sm">
      <div class="card-body d-flex flex-column justify-content-center align-items-center">
        <h5 class="card-title">${type}</h5>
        <p class="card-text display-6">${count}</p>
      </div>
    </div>
  `;

  breakdownDiv.appendChild(card);
});



  /*
 
*/
  }

/*
 
  */
  async function loadItemTypesIntoSelect(selectElement) {
    try {
      const res = await fetch('/api/item-types');
      const itemTypes = await res.json();
  
      selectElement.innerHTML = '<option value="">Select type</option>';
  
      itemTypes.forEach(type => {
        const option = document.createElement('option');
       // option.value = type.name;  or type.id if using IDs
       option.value = type.id
        option.textContent = type.name;
        selectElement.appendChild(option);
      });
    } catch (error) {
      console.error('Failed to load item types:', error);
      alert('Could not load item types. Please try again.');
    }
  }
  
 function exportUserTableToExcel() {
  const table = document.getElementById("itemsTable");
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Inventory" });
  XLSX.writeFile(workbook, "inventory_export.xlsx");
}