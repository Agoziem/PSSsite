document.addEventListener("DOMContentLoaded", function () {
  // Checkbox change event
  const columnCheckboxes = document.querySelectorAll(".column-checkbox");
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
  const unhideAllCheckbox = document.getElementById("UnhideAllCheckbox");
  unhideAllCheckbox.addEventListener("change", function () {
    const isChecked = this.checked;

    // Show/hide all columns based on the Unhide All checkbox
    columnCheckboxes.forEach(function (checkbox) {
      checkbox.checked = isChecked;
      checkbox.dispatchEvent(new Event("change"));
    });
  });
});

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

export default class DataTable {
  constructor(inputStudentResultModal, inputform) {
    this.inputStudentResultModal = inputStudentResultModal;
    this.inputform = inputform;
    this.table = document.getElementById("dataTable");
    this.rows = Array.from(document.querySelectorAll(".table tbody tr"));
    this.rowcheckboxes = Array.from(
      document.querySelectorAll(".row-checkbox-group")
    );
    document
      .querySelector("#tableHeader")
      .addEventListener("click", this.getsortingdata.bind(this));
    document
      .querySelector("#filterInput")
      .addEventListener("input", this.filterItems.bind(this));
    this.table.addEventListener("click", this.setupeditmode.bind(this));
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
    // const rowcheckboxes = this.rowcheckboxes
    // const paginatedcheckbox = rowcheckboxes.slice(startIndex, endIndex);

    // Update table body and the respective chedkboxes
    this.renderRows(paginatedRows);

    // Update pagination
    this.renderPagination(filteredrows.length, startIndex, endIndex);
  }

  renderRows(rows) {
    const tbody = this.table.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    rows.forEach((row) => {
      tbody.appendChild(row);
    });

    // rowcheckboxes.innerHTML = '';
    // paginatedcheckbox.forEach(checkbox => {
    //     rowcheckboxes.appendChild(checkbox);
    // })

    // const checkboxes = rowcheckboxes.querySelectorAll('.row-checkbox')
    // checkboxes.forEach(checkbox => {
    //     const rowNumber = checkbox.getAttribute('data-row');
    //     const storedState = localStorage.getItem(`row-${rowNumber}`);

    //     if (storedState === 'hidden') {
    //         checkbox.checked = true;
    //         this.handleCheckboxChange({ target: checkbox });
    //     }
    // });

    // rowcheckboxes.addEventListener('click', (e) => {
    //     if (e.target.classList.contains('row-checkbox')) {
    //         this.handleCheckboxChange(e)
    //     }
    // })

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

  //  handleCheckboxChange(event) {
  //     const checkbox = event.target;
  //     const rowNumber = checkbox.getAttribute('data-row');
  //      const row = document.querySelector(`tbody tr[data-rowindex="${rowNumber}"]`);
  //     if (row === null) {
  //         return;
  //     } else {
  //         // Update visibility and store state in local storage
  //         if (checkbox.checked) {
  //             row.style.display = 'none';
  //             localStorage.setItem(`row-${rowNumber}`, 'hidden');
  //         } else {
  //             row.style.display = '';
  //             localStorage.removeItem(`row-${rowNumber}`);
  //         }
  //     }
  // }

  // Function to filter the table data
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

  // Function to sort the table data
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
    // const rowcheckboxes = this.rowcheckboxes
    // const sortedrowcheckboxes = rowcheckboxes.slice(startIndex, endIndex);

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
    this.sortOrder = order === "asc" ? "desc" : "asc";
    this.renderRows(Rowstosort);
  }

  // populate the student result form with the selected student data
  setupeditmode(e) {
    const target = e.target;
    if (target.tagName === "A" && target.closest("td")) {
      e.preventDefault();
      this.changemode(target);
    }
  }

  changemode(target) {
    const tablerow = target.closest("tr");
    const tabledata = Array.from(tablerow.children);

    const studentnameinput = this.inputform.querySelector("#student_name");
    studentnameinput.value = tabledata[1].innerText;

    const studentidinput = this.inputform.querySelector("#studentID");
    studentidinput.value = tabledata[14].innerText;

    const FirstTest = this.inputform.querySelector("#FirstTest");
    FirstTest.value = tabledata[2].innerText;

    const FirstAss = this.inputform.querySelector("#FirstAss");
    FirstAss.value = tabledata[3].innerText;

    const MidTermTest = this.inputform.querySelector("#MidTermTest");
    MidTermTest.value = tabledata[4].innerText;

    const Project = this.inputform.querySelector("#Project");
    Project.value = tabledata[5].innerText;

    const SecondAss = this.inputform.querySelector("#SecondAss");
    SecondAss.value = tabledata[6].innerText;

    const SecondTest = this.inputform.querySelector("#SecondTest");
    SecondTest.value = tabledata[7].innerText;

    const Exam = this.inputform.querySelector("#Exam");
    Exam.value = tabledata[8].innerText;

    $(this.inputStudentResultModal).modal("show");
  }
}
