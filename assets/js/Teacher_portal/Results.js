const inputStudentResultModal = document.querySelector('#inputStudentResultModal')
const inputform = inputStudentResultModal.querySelector('#inputStudentResultform')
const getstudentresultform = document.querySelector('#getstudentresultform')
const subjectselect = getstudentresultform.querySelector('select');
const classinput = getstudentresultform.querySelector('input');
const termSelect = document.getElementById('termSelect');
const Examforminput = document.querySelector('.Examinput');
const academicSessionSelect = document.getElementById('academicSessionSelect');
const rowcheckboxes = document.querySelector('.rowgroup');
document.querySelectorAll(".publishbtn").forEach((btn) => {
    btn.addEventListener('click', exportTableToJSON);
})

let classdata = {
    studentclass: classinput.value, 
}

const alertcontainer = document.querySelector('.alertcontainer')


// Function to save selected values to localStorage
function saveformSelections() {
    localStorage.setItem('selectedresultTerm', termSelect.value);
    localStorage.setItem('selectedresultAcademicSession', academicSessionSelect.value);
    localStorage.setItem('selectedresultsubject', subjectselect.value);
    classdata.selectedTerm = termSelect.value;
    classdata.selectedAcademicSession = academicSessionSelect.value;
    classdata.studentsubject = subjectselect.options[subjectselect.selectedIndex].value;

    // check whether the subject is Moral to adjust the Exam input Restrictions
    if (subjectselect.value === 'Moral instruction') {
        Examforminput.innerHTML = ''
        Examforminput.innerHTML = `
                            <label for="Exam" class="form-label">Exam Score (100)</label>
                            <input type="number" class="form-control" id="Exam" name="Exam" min="0" max="100">`
    } else {
        Examforminput.innerHTML = ''
        Examforminput.innerHTML = `
                            <label for="Exam" class="form-label">Exam Score (60)</label>
                            <input type="number" class="form-control" id="Exam" name="Exam" min="0" max="60">`
    }
    readJsonFromFile()
}

// Function to load saved values from localStorage
function loadsavedSelection() {
    const savedTerm = localStorage.getItem('selectedresultTerm');
    const savedAcademicSession = localStorage.getItem('selectedresultAcademicSession');
    const savedsubject = localStorage.getItem('selectedresultsubject');

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

    if (savedsubject !== null) {
        subjectselect.value = savedsubject;
        classdata.studentsubject = subjectselect.value;
    } else {
        classdata.studentsubject = subjectselect.value;
    }

    // check whether the subject is Moral to adjust the Exam input Restrictions
    if (subjectselect.value === 'Moral instruction') {
        Examforminput.innerHTML = ''
        Examforminput.innerHTML =`
                            <label for="Exam" class="form-label">Exam Score (100)</label>
                            <input type="number" class="form-control" id="Exam" name="Exam" min="0" max="100">`
    } else {
        Examforminput.innerHTML = ''
        Examforminput.innerHTML = `
                            <label for="Exam" class="form-label">Exam Score (60)</label>
                            <input type="number" class="form-control" id="Exam" name="Exam" min="0" max="60">`
    }
    

    readJsonFromFile();
}


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
      student.CA = this.calculateCA(student);
      student.Total = this.calculateTotal(student);
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
    calculateCA(student) {
        const keys = Object.keys(student);
        const startIndex = keys.indexOf("Name") + 1;
        const endIndex = keys.indexOf("Exam");
        const relevantKeys = keys.slice(startIndex,endIndex);
        return relevantKeys.reduce((sum, key) => sum + (isNaN(student[key]) || student[key] === '' ? 0 : parseInt(student[key])), 0);
    }

    calculateTotal(student) {
        if (student['Exam'] === '-' || student['Exam'] === '') {
            return '-'
        } else {
            return Object.keys(student)
                .filter(key => key.startsWith("CA") || key.startsWith("Exam"))
                .reduce((sum, key) => sum + (isNaN(student[key]) ? 0 : parseInt(student[key])), 0);
        }
    }
    
  calculateGrade(student) {
      const Total = this.calculateTotal(student);
      if (Total === '-') {
          return '-' 
      } else {
          if (Total >= 70) return "A";
          else if (Total >= 55) return "C";
          else if (Total >= 40) return "P";
          else return "F";
      }
}

  calculatePosition() {
    
      this.students.sort((a, b) => {
          if (a.Total === '-' && b.Total === '-') {
              return 0; 
          } else if (b.Total === '-') {
              return -1; 
          } else {
              return b.Total - a.Total; 
          }
      });

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

    let previousTotal = null;
    let previousPosition = null;
      
    this.students.forEach((student, index) => {
        const currentTotal = student.Total;
        const suffix = getOrdinalSuffix(index + 1);

        if (currentTotal === '-') {
            student.Position = '-'
        }else if (currentTotal === previousTotal) {
            // Assign the same position as the previous student
            student.Position = previousPosition;
        } else {
            // Assign a new position
            student.Position = `${index + 1}${suffix}`;
        }

        // Update previous total and position
        previousTotal = currentTotal;
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


async function readJsonFromFile() {
  try {
    const jsonData = await getstudentdata(classdata);
    const studentHandler = new StudentDataHandler(jsonData);
    const studentsWithCalculatedFields = studentHandler.getStudents();
    //   populaterowcheckbox(studentsWithCalculatedFields)
      populatetable(studentsWithCalculatedFields)

      // Check if the data exists in local storage
      const existingData = localStorage.getItem('studentsData');
      if (existingData) {
          const parsedData = JSON.parse(existingData);
          parsedData.studentsWithCalculatedFields = studentsWithCalculatedFields;

          localStorage.setItem('studentsData', JSON.stringify(parsedData));
      } else {
          const newData = {
            studentsWithCalculatedFields: studentsWithCalculatedFields,
          };
          localStorage.setItem('studentsData', JSON.stringify(newData));
      }
      const dataTable = new DataTable();
      
  } catch (error) {
    console.error('Error reading JSON file:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    getstudentresultform.addEventListener('submit', (e) => {
        e.preventDefault()
        saveformSelections();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('inputStudentResultform').addEventListener('submit', (e) => {
        e.preventDefault()
        const formData = new FormData(inputform);
        const formDataObject = {};
        formData.forEach((value, key) => {
        formDataObject[key] = value;
        });
        classdata.studentsubject = subjectselect.options[subjectselect.selectedIndex].value;
        classdata.selectedTerm = termSelect.value,
        classdata.selectedAcademicSession = academicSessionSelect.value,
        updatestudentresult(formDataObject,classdata)
        $(inputStudentResultModal).modal('hide');
    });
});


// initial populating of the Table rows and the row Checkboxes
// function populaterowcheckbox(tabledata) {
//     const rowcheckcontainer = rowcheckboxes
//     rowcheckcontainer.innerHTML = tabledata.map((data, index) => `
//         <li class="list-group-item row-checkbox-group">
//             <label class="form-check-label text-primary">
//                 <input class="form-check-input me-2 row-checkbox" type="checkbox" data-row="${index + 1}" > ${data.Name}
//             </label>
//         </li>`
//     ).join(''); 
// }


function populatetable(tabledata) {
    const tbody = document.querySelector('#dataTable').lastElementChild;
    tbody.innerHTML = tabledata.map((data,index) => `
        <tr data-rowindex='${index + 1}'>
            <td>${index + 1}</td>
            <td class="text-primary text-uppercase"><a class="inputdetailsformmodelbtn text-decoration-none" style="cursor:pointer">${data.Name}</a></td>
            <td>${data['1sttest']}</td>
            <td>${data['1stAss']}</td>
            <td>${data['MidTermTest']}</td>
            <td>${data['Project']}</td>
            <td>${data['2ndTest']}</td>
            <td>${data['2ndAss']}</td>
            <td>${data['CA'] || '-'}</td>
            <td>${data['Exam']}</td> 
            <td>${data['Total'] || '-'}</td>
            <td>${data['Grade'] || '-'}</td>
            <td>${data['Position'] || '-'}</td>
            <td>${data['Remarks'] || '-'}</td>
            <td>${data['studentID'] || '-'}</td>
        </tr>`
    ).join('');
}


// getting and updating from the server
async function getstudentdata(classdata) {
    const response = await fetch(`/TeachersPortal/getstudentresults/`,{
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

function updatestudentresult(formDataObject, classdata) {
    const fullresultdata = {
        formDataObject,
        classdata
    }
    fetch(`/TeachersPortal/updatestudentresults/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(fullresultdata)
    })
        .then(response => response.json())
        .then(data => {
            readJsonFromFile()
            const type = 'alert-success'
            const message = data
            displayalert(type, message)
        })
        .catch(error => console.error('Error:', error));
}

function exportTableToJSON() {
    const existingData = localStorage.getItem('studentsData');
    const parsedData = JSON.parse(existingData);
    const datatosubmit = parsedData.studentsWithCalculatedFields
    classdata.studentsubject = subjectselect.options[subjectselect.selectedIndex].value;
    classdata.studentclass = classinput.value
    classdata.selectedTerm = termSelect.value,
    classdata.selectedAcademicSession = academicSessionSelect.value,
    submitallstudentresult(datatosubmit, classdata)
}

function submitallstudentresult(data, classdata) {
    const resulttosubmit = {
        data,
        classdata
    }
    fetch(`/TeachersPortal/submitallstudentresult/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(resulttosubmit)
    })
        .then(response => response.json())
        .then(data => {
            const type = 'alert-success'
            const message = data
            displayalert(type, message)
        })
        .catch(error => console.error('Error:', error));
}


    document.addEventListener("DOMContentLoaded", function () {
        // Checkbox change event
        const columnCheckboxes = document.querySelectorAll('.column-checkbox');
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
        const unhideAllCheckbox = document.getElementById('UnhideAllCheckbox');
        unhideAllCheckbox.addEventListener('change', function () {
            const isChecked = this.checked;

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
        this.rows = Array.from(document.querySelectorAll('.table tbody tr'));
        this.rowcheckboxes = Array.from(document.querySelectorAll('.row-checkbox-group'));
        document.querySelector('#tableHeader').addEventListener('click',this.getsortingdata.bind(this));
        document.querySelector("#filterInput").addEventListener('input', this.filterItems.bind(this));
        this.table.addEventListener('click', this.setupeditmode.bind(this));
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
        // const rowcheckboxes = this.rowcheckboxes
        // const paginatedcheckbox = rowcheckboxes.slice(startIndex, endIndex);
        
        // Update table body and the respective chedkboxes
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
        // const rowcheckboxes = this.rowcheckboxes
        // const sortedrowcheckboxes = rowcheckboxes.slice(startIndex, endIndex);
        
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

    
    setupeditmode(e){
        const target = e.target;
    // Check if the click is on an <a> element inside a <td>
        if (target.tagName === 'A' && target.closest('td')) {
        e.preventDefault();
        this.changemode(target)
    }
    }

    changemode(target) {
    const tablerow = target.closest('tr')
    const tabledata = Array.from(tablerow.children)

    const studentnameinput = inputform.querySelector('#student_name')
    studentnameinput.value = tabledata[1].innerText

    const studentidinput = inputform.querySelector('#studentID')
    studentidinput.value = tabledata[14].innerText

    const FirstTest = inputform.querySelector('#FirstTest')
    FirstTest.value = tabledata[2].innerText

    const FirstAss = inputform.querySelector('#FirstAss')
    FirstAss.value = tabledata[3].innerText

    const MidTermTest = inputform.querySelector('#MidTermTest')
        MidTermTest.value = tabledata[4].innerText

    const Project = inputform.querySelector('#Project')
    Project.value = tabledata[5].innerText

    const SecondAss = inputform.querySelector('#SecondAss')
    SecondAss.value = tabledata[6].innerText

    const SecondTest = inputform.querySelector('#SecondTest')
    SecondTest.value = tabledata[7].innerText

    const Exam = inputform.querySelector('#Exam')
    Exam.value = tabledata[8].innerText
    
    $(inputStudentResultModal).modal('show');
}

   
}

loadsavedSelection();




