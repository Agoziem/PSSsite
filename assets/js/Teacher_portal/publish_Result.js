
// Handling Student Info
const classinput = document.querySelector('.classinput');
const subjectlistinput = document.querySelector('.subjectlist');
const subjectlist = subjectlistinput.value
const modifiedList = subjectlist.replace(/'/g, '"');
let jsonstring = `${modifiedList}`
let mainsubjectlist = JSON.parse(jsonstring);
const alertcontainer = document.querySelector('.alertcontainer')
const termSelect = document.getElementById('termSelect');
const academicSessionSelect = document.getElementById('academicSessionSelect');
const publishButton = document.getElementById('publishbtn');
termSelect.addEventListener('change', function () {
    saveSelection();
});

academicSessionSelect.addEventListener('change', function () {
    saveSelection();
});

let classdata = {
    studentclass: classinput.value,
}

// Function to save selected values to localStorage
function saveSelection() {
    localStorage.setItem('selectedTerm', termSelect.value);
    localStorage.setItem('selectedAcademicSession', academicSessionSelect.value);
    classdata.selectedTerm = termSelect.value;
    classdata.selectedAcademicSession = academicSessionSelect.value;
    readJsonFromFile()
}

// Function to load saved values from localStorage
function loadSelection() {
    const savedTerm = localStorage.getItem('selectedTerm');
    const savedAcademicSession = localStorage.getItem('selectedAcademicSession');

    if (savedTerm !== null) {
        termSelect.value = savedTerm;
        classdata.selectedTerm = termSelect.value
    } else {
        classdata.selectedTerm = termSelect.value
    }

    if (savedAcademicSession !== null) {
        academicSessionSelect.value = savedAcademicSession;
        classdata.selectedAcademicSession = academicSessionSelect.value;
    } else {
        classdata.selectedAcademicSession = academicSessionSelect.value;
    }
    readJsonFromFile();
}






// functions to disable the button when the Term and Academic Session have not been 

function displayalert(type, message) {
    const alertdiv = document.createElement('div');
    alertdiv.classList.add('alert', `${type}`, 'd-flex', 'align-items-center', 'mt-3');
    alertdiv.setAttribute('role', 'alert');
    alertdiv.innerHTML = `
                        <i class="fa-solid fa-circle-check h6 me-2"></i>
                        <div>
                           ${message}
                        </div>
                        `
    alertcontainer.appendChild(alertdiv)

    setTimeout(() => {
        alertdiv.remove();
    }, 3000);

}


class StudentDataHandler {
  constructor(data) {
    this.students = data;
    this.calculateFields();
  }

  calculateFields() {
    this.students.forEach(student => {
      student.Total = this.calculateTotal(student);
      student.Ave = this.calculateAverage(student);
      student.Grade = this.calculateGrade(student);
      student.Position = "-";
      student.Remarks = "-";
    });

    // Calculate position based on Total
    this.calculatePosition();

    // Calculate remarks based on Grade
    this.calculateRemarks();
    }
    
    // this has to be Calulated dynamically
    calculateTotal(student) {
      const keys = Object.keys(student);
        const startIndex = keys.indexOf("Name") + 1;
        const relevantKeys = keys.slice(startIndex);
        return relevantKeys.reduce((sum, key) => sum + (isNaN(student[key]) ? 0 : parseInt(student[key])), 0);
  }

    // this has to be Calulated dynamically
    calculateAverage(student) {
    const keys = Object.keys(student);
    const startIndex = keys.indexOf("Name") + 1;
    const relevantKeys = keys.slice(startIndex, keys.length - 1)
    const greaterThanOrEqualToOneCount = relevantKeys.filter(key => parseInt(student[key]) >= 0 && student[key] !== '-').length; 
    // Check if greaterThanOrEqualToOneCount is not zero before performing the division
    const average = greaterThanOrEqualToOneCount !== 0
    ? parseFloat((student.Total / greaterThanOrEqualToOneCount).toFixed(2))
    : 0;
    
    return average;
        
  }

  calculateGrade(student) {
   
    if (student.Ave >= 70) return "A";
    else if (student.Ave >= 55) return "C";
    else if (student.Ave >= 40) return "P";
    else return "F";
}

  calculatePosition() {
    
    this.students.sort((a, b) => b.Ave - a.Ave);

    // Function to calculate ordinal suffix
    const getOrdinalSuffix = (number) => {
        if (number === 11 || number === 12 || number === 13) {
            return 'th';
        } else {
            const lastDigit = number % 10;
            switch (lastDigit) {
                case 1:
                    return 'st';
                case 2:
                    return 'nd';
                case 3:
                    return 'rd';
                default:
                    return 'th';
            }
        }
    };

    let previousAve = null;
      let previousPosition = null;
      
    this.students.forEach((student, index) => {
        const currentTotal = student.Ave;
        const suffix = getOrdinalSuffix(index + 1);

        if (currentTotal === previousAve) {
            // Assign the same position as the previous student
            student.Position = previousPosition;
        } else {
            // Assign a new position
            student.Position = `${index + 1}${suffix}`;
        }

        // Update previous total and position
        previousAve = currentTotal;
        previousPosition = student.Position;
    });
}


  calculateRemarks() {
    this.students.forEach(student => {
      if (student.Grade === "-") student.Remarks = "-";
      else if (student.Grade === "A") student.Remarks = "Excellent";
      else if (student.Grade === "C") student.Remarks = "Good";
      else if (student.Grade === "P") student.Remarks = "Pass";
      else student.Remarks = "Fail";
    });
  }

  getStudents() {
    return this.students;
  }
}

// function to get Student Result
async function readJsonFromFile() {
  try {
    const jsonData = await getstudentresult(classdata);
    const studentHandler = new StudentDataHandler(jsonData);
    const studentsWithCalculatedFields = studentHandler.getStudents();
      populatetable(studentsWithCalculatedFields)
      const dataTable = new DataTable();
  } catch (error) {
    console.error('Error reading JSON file:', error);
  }
}


// function to Populate the Table
function populatetable(tabledata) {
    const tbody = document.querySelector('#dataTable').lastElementChild;
    tbody.innerHTML = tabledata.map((data, index) =>
        `
        <tr>
            <td>${index + 1}</td>
            <td class="text-primary">${data.Name}</td>
            ${mainsubjectlist.map(subject => `<td>${data[subject]}</td>`).join('')}
            <td>${data.Total}</td>
            <td>${data.Ave}</td>
            <td>${data.Grade}</td>
            <td>${data.Position}</td>
            <td>${data.Remarks}</td>
        </tr>`
    ).join('');
}


async function getstudentresult(classdata) {
    const response = await fetch(`/TeachersPortal/getstudentsubjecttotals/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(classdata)
    })
    const data = await response.json();
    return data;
}



document.addEventListener("DOMContentLoaded", function () {
        // Checkbox change event
        var columnCheckboxes = document.querySelectorAll('.column-checkbox');
        columnCheckboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
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
        var unhideAllCheckbox = document.getElementById('UnhideAllCheckbox');
        unhideAllCheckbox.addEventListener('change', function () {
            var isChecked = this.checked;

            // Show/hide all columns based on the Unhide All checkbox
            columnCheckboxes.forEach(function (checkbox) {
                checkbox.checked = isChecked;
                checkbox.dispatchEvent(new Event('change'));
            });
        });
    });

    function hideColumn(columnIndex) {
        var headers = document.querySelectorAll(`th[data-index="${columnIndex}"]`);
        var cells = document.querySelectorAll(`td:nth-child(${parseInt(columnIndex) + 2})`);

        headers.forEach(function (header) {
            header.style.display = 'none';
        });

        cells.forEach(function (cell) {
            cell.style.display = 'none';
        });
    }

    function showColumn(columnIndex) {
        var headers = document.querySelectorAll(`th[data-index="${columnIndex}"]`);
        var cells = document.querySelectorAll(`td:nth-child(${parseInt(columnIndex) + 2})`);

        headers.forEach(function (header) {
            header.style.display = '';
        });

        cells.forEach(function (cell) {
            cell.style.display = '';
        });
    }


// Table object and functionality
class DataTable {
    constructor() {
        this.table = document.getElementById('dataTable');
        document.querySelector('#tableHeader').addEventListener('click',this.getsortingdata.bind(this));
        document.querySelector("#filterInput").addEventListener('input', this.filterItems.bind(this));
        publishButton.addEventListener('click', this.exportTableToJSON.bind(this));
        this.rows = Array.from(document.querySelectorAll('.table tbody tr'));
        this.pageSize=10
        this.currentPage = 1;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTable();
    }

    setupEventListeners() {
        document.getElementById('lengthSelect').addEventListener('change', () => {
            this.pageSize = parseInt(document.getElementById('lengthSelect').value);
            this.currentPage = 1;
            this.updateTable();
        });

        document.querySelector('.pagination').addEventListener('click', (e) => {
            if (e.target.classList.contains('page-link')) {
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
        const filteredrows = this.rows
        const paginatedRows = filteredrows.slice(startIndex, endIndex);

        // Update table body
        this.renderRows(paginatedRows);

        // Update pagination
        this.renderPagination(filteredrows.length,startIndex,endIndex);
    }

    filterItems(e) {
        const text = e.target.value.toLowerCase();
        const filterrows = this.rows

        filterrows.forEach((row,index) => {
        const itemName = row.firstElementChild.nextElementSibling.innerText.toLowerCase();
            if (itemName.indexOf(text) !== -1) {
            row.style.display = 'table-row';

        } else {
                row.style.display = 'none';
        }
        });
    
    }

    

    renderRows(rows) {
        const tbody = this.table.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        rows.forEach(row => {
            tbody.appendChild(row);
        });

        let columnCheckboxes = document.querySelectorAll('.column-checkbox');
        columnCheckboxes.forEach(function (checkbox) {  
            const columnIndex = checkbox.value;
            if (columnIndex) {
                if (checkbox.checked) {
                // Hide the corresponding column
                hideColumn(columnIndex);
                } else {
                    // Show the corresponding column
                    showColumn(columnIndex);
                };
            }
        });
    }

    renderPagination(totalRows,startIndex,endIndex) {
        const totalPages = Math.ceil(totalRows / this.pageSize);
        const pagination = document.querySelector('.pagination');
        const paginationliteral = document.querySelector('.pagination-literal');

        // Render pagination links
        let paginationHtml = '<li class="page-item"><a class="page-link" data-page="1" style="cursor:pointer">&laquo;</a></li>';
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<li class="page-item ${i === this.currentPage ? 'active' : ''}"><a class="page-link" data-page="${i}" style="cursor:pointer">${i}</a></li>`;
        }
        paginationHtml += `<li class="page-item"><a class="page-link" data-page="${totalPages}" style="cursor:pointer">&raquo;</a></li>`;

        pagination.innerHTML = paginationHtml;

        paginationliteral.innerHTML = `showing ${startIndex + 1} to ${endIndex} of ${totalRows} Students`
    }

    getsortingdata(e){
        const columnIndex = 1;
        this.sortTable(columnIndex);
    };

    sortTable(columnIndex) {

        const pageNumber = document.querySelector('.page-item.active').firstElementChild.dataset.page;
        this.currentPage = parseInt(pageNumber)
        
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        
        // Filter and paginate rows
        const pagerows = this.rows
        const Rowstosort = pagerows.slice(startIndex, endIndex);
        
        const order = this.sortOrder || 'asc';
        
        Rowstosort.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.trim().toLowerCase();
            const bValue = b.cells[columnIndex].textContent.trim().toLowerCase();

            let comparison = 0;
            if (aValue > bValue) {
                comparison = 1;
            } else if (aValue < bValue) {
                comparison = -1;
            }

            return order === 'desc' ? comparison * -1 : comparison;
        });

    // Toggle sort order for the next click
        this.sortOrder = order === 'asc' ? 'desc' : 'asc';
        this.renderRows(Rowstosort)
        
    }

    exportTableToJSON() {
      
      const data = [];

      this.rows.forEach((row) => {
        const rowData = {};
        const cells = row.querySelectorAll('td');
        
        cells.forEach((cell, index) => {
          const headerText = this.table.querySelector(`thead th:nth-child(${index + 1})`).innerText;
          rowData[headerText] = cell.innerText;
        });

        data.push(rowData);
      });
        
        classdata.studentclass = classinput.value,
        classdata.selectedTerm = termSelect.value,
        classdata.selectedAcademicSession = academicSessionSelect.value,
    
            this.publishstudentresult(data, classdata)
    }

    publishstudentresult(data,classdata) {
        const fulldata = {
            data,
            classdata
        }
        fetch(`/TeachersPortal/publishstudentresult/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(fulldata)
    })
        .then(response => response.json())
        .then(data => {
            if (data.type === 'success') {
                const type = 'alert-success';
                const message = data.message;
                displayalert(type, message);
            } else if (data.type === 'error') {
                const type = 'alert-danger';
                const message = data.message;
                displayalert(type, message);
            } else {
                console.error('Unexpected response type:', data.type);
            }
        })
        .catch(error => console.error('Error:', error));
}
   
}

window.addEventListener('DOMContentLoaded', () => {
    loadSelection();
    
})



