document.addEventListener("DOMContentLoaded", function () {
  // Checkbox change event
  var columnCheckboxes = document.querySelectorAll(".column-checkbox");
  columnCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      const columnIndex = checkbox.value;

      if (this.checked) {
        // Hide the corresponding column
        hideColumn(columnIndex);
      } else {
        // Show the corresponding column
        showColumn(columnIndex);
      }
    });
  });

  // Unhide All checkbox change event
  var unhideAllCheckbox = document.getElementById("UnhideAllCheckbox");
  unhideAllCheckbox.addEventListener("change", function () {
    var isChecked = this.checked;

    // Show/hide all columns based on the Unhide All checkbox
    columnCheckboxes.forEach(function (checkbox) {
      checkbox.checked = isChecked;
      checkbox.dispatchEvent(new Event("change"));
    });
  });
});

// function to hide and show columns //////////////////////////////////

function hideColumn(columnIndex) {
  var headers = document.querySelectorAll(`th[data-index="${columnIndex}"]`);
  var cells = document.querySelectorAll(
    `td:nth-child(${parseInt(columnIndex) + 2})`
  );

  headers.forEach(function (header) {
    header.style.display = "none";
  });

  cells.forEach(function (cell) {
    cell.style.display = "none";
  });
}

function showColumn(columnIndex) {
  var headers = document.querySelectorAll(`th[data-index="${columnIndex}"]`);
  var cells = document.querySelectorAll(
    `td:nth-child(${parseInt(columnIndex) + 2})`
  );

  headers.forEach(function (header) {
    header.style.display = "";
  });

  cells.forEach(function (cell) {
    cell.style.display = "";
  });
}

// Table object and functionality //////////////////////////////////
export default class ClassResultDataTable {
  constructor() {
    this.table = document.getElementById("dataTable");
    document
      .querySelector("#tableHeader")
      .addEventListener("click", this.getsortingdata.bind(this));
    document
      .querySelector("#filterInput")
      .addEventListener("input", this.filterItems.bind(this));
    this.rows = Array.from(document.querySelectorAll(".table tbody tr"));
    this.pageSize = 10;
    this.currentPage = 1;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateTable();
  }

  setupEventListeners() {
    document.getElementById("lengthSelect").addEventListener("change", () => {
      this.pageSize = parseInt(document.getElementById("lengthSelect").value);
      this.currentPage = 1;
      this.updateTable();
    });

    document.querySelector(".pagination").addEventListener("click", (e) => {
      if (e.target.classList.contains("page-link")) {
        e.preventDefault();
        const page = parseInt(e.target.dataset.page);
        if (!isNaN(page)) {
          this.currentPage = page;
          this.updateTable();
        }
      }
    });
  }

  updateTable() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // Filter and paginate rows
    const filteredrows = this.rows;
    const paginatedRows = filteredrows.slice(startIndex, endIndex);

    // Update table body
    this.renderRows(paginatedRows);

    // Update pagination
    this.renderPagination(filteredrows.length, startIndex, endIndex);
  }

  // Render rows
  renderRows(rows) {
    const tbody = this.table.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    rows.forEach((row) => {
      tbody.appendChild(row);
    });

    let columnCheckboxes = document.querySelectorAll(".column-checkbox");
    columnCheckboxes.forEach(function (checkbox) {
      const columnIndex = checkbox.value;
      if (columnIndex) {
        if (checkbox.checked) {
          // Hide the corresponding column
          hideColumn(columnIndex);
        } else {
          // Show the corresponding column
          showColumn(columnIndex);
        }
      }
    });
  }

  // Render pagination
  renderPagination(totalRows, startIndex, endIndex) {
    const totalPages = Math.ceil(totalRows / this.pageSize);
    const pagination = document.querySelector(".pagination");
    const paginationliteral = document.querySelector(".pagination-literal");

    // Render pagination links
    let paginationHtml =
      '<li class="page-item"><a class="page-link" data-page="1" style="cursor:pointer">&laquo;</a></li>';
    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `<li class="page-item ${
        i === this.currentPage ? "active" : ""
      }"><a class="page-link" data-page="${i}" style="cursor:pointer">${i}</a></li>`;
    }
    paginationHtml += `<li class="page-item"><a class="page-link" data-page="${totalPages}" style="cursor:pointer">&raquo;</a></li>`;

    pagination.innerHTML = paginationHtml;

    paginationliteral.innerHTML = `showing ${
      startIndex + 1
    } to ${endIndex} of ${totalRows} Students`;
  }

  // Filter items
  filterItems(e) {
    const text = e.target.value.toLowerCase();
    const filterrows = this.rows;

    filterrows.forEach((row, index) => {
      const itemName =
        row.firstElementChild.nextElementSibling.innerText.toLowerCase();
      if (itemName.indexOf(text) !== -1) {
        row.style.display = "table-row";
      } else {
        row.style.display = "none";
      }
    });
  }

  // Sorting items
  getsortingdata(e) {
    const columnIndex = 1;
    this.sortTable(columnIndex);
  }

  sortTable(columnIndex) {
    const pageNumber =
      document.querySelector(".page-item.active").firstElementChild.dataset
        .page;
    this.currentPage = parseInt(pageNumber);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // Filter and paginate rows
    const pagerows = this.rows;
    const Rowstosort = pagerows.slice(startIndex, endIndex);

    const order = this.sortOrder || "asc";

    Rowstosort.sort((a, b) => {
      const aValue = a.cells[columnIndex].textContent.trim().toLowerCase();
      const bValue = b.cells[columnIndex].textContent.trim().toLowerCase();

      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      return order === "desc" ? comparison * -1 : comparison;
    });

    // Toggle sort order for the next click
    this.sortOrder = order === "asc" ? "desc" : "asc";
    this.renderRows(Rowstosort);
  }
}
