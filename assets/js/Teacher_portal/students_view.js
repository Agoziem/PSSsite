const addandeditstudentdetailModal = document.querySelector('#AddandeditStudentModal')
const modallabel = addandeditstudentdetailModal.querySelector('#AddandeditStudentModalLabel');
const modalformsubmitbtn = addandeditstudentdetailModal.querySelector('#mainsubmitbtn')
const spinner = document.querySelector('.spinner-border')
const deletestudentModal = document.querySelector('#deletestudentModal');
const deleteallstudentbtn = document.querySelector('#deleteallstudentbtn')
const addandeditstudentdetailform = document.querySelector('#addandeditstudentdetailform')
const studentclass = document.querySelector('#studentclass').value;
const alertcontainer = document.querySelector('.alertcontainer')
const deletestudentbtn = document.querySelector('#deletestudentbtn')
const removestudentsactionbtn = document.querySelector('#removestudentsactionbtn')
const removeallstudentactionbtn = document.querySelector('#removeallstudentactionbtn')
const datatablesSimple = document.getElementById('datatablesSimple');
let dataTable = new simpleDatatables.DataTable(datatablesSimple);
let rowToRemove;
let rowstoremove = [];
let studentidtoremove = [];
let isedit = false;

addandeditstudentdetailform.addEventListener('submit', processform);

datatablesSimple.addEventListener('click', function (e) {
    const target = e.target;
    // Check if the click is on a checkbox inside a <td>
    if (target.tagName === 'INPUT' && target.type === 'checkbox' && target.closest('td')) {
        const row = target.closest('tr');
        const studentid = target.value
        const rowIndex = parseInt(row.dataset.index);

        // Check if the checkbox is checked
        if (target.checked) {
            // Add the index to rowstoremove if not already present
            if (rowstoremove.indexOf(rowIndex) === -1 && studentidtoremove.indexOf(studentid) === -1) {
                rowstoremove.push(rowIndex);
                studentidtoremove.push(studentid)
            }

        } else {
            // Remove the index from rowstoremove
            const indexToRemove = rowstoremove.indexOf(rowIndex);
            const idToRemove = studentidtoremove.indexOf(studentid);
            if (indexToRemove !== -1) {
                rowstoremove.splice(indexToRemove, 1);
                studentidtoremove.splice(idToRemove, 1);
          
            }
        }
    }

    // Check if the click is on an <a> element inside a <td>
    if (target.tagName === 'A' && target.closest('td')) {
        e.preventDefault();
        rowToRemove = target.closest('tr');
        changemode(target)
    }
});

deletestudentbtn.addEventListener('click', removestudents)
function removestudents() {
    removefromserver(studentidtoremove)
    dataTable.rows.remove(rowstoremove)
    dataTable.refresh()
    $(deletestudentModal).modal('hide');
    setUIState()
}

deleteallstudentbtn.addEventListener('click', removeallstudents)
function removeallstudents() {
    const tablesrows = Array.from(datatablesSimple.firstElementChild.nextElementSibling.children);
    tablesrows.forEach((row) => {
        const rowindex = parseInt(row.dataset.index);
        const studentID = row.firstElementChild.firstElementChild.value
        rowstoremove.push(rowindex)
        studentidtoremove.push(studentID)
    })

    removefromserver(studentidtoremove)
    dataTable.rows.remove(rowstoremove)
    dataTable.refresh()
    const deleteallstudentModal = document.querySelector('#deleteallstudentModal')
    $(deleteallstudentModal).modal('hide');
    setUIState()
}

function removefromserver(studentidtoremove) {
    fetch(`/TeachersPortal/DeleteStudents/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(studentidtoremove)
    })
        .then(response => response.json())
        .then(data => {
            const type = 'alert-success'
            const message = data['message']
            displayalert(type, message)
        })
        .catch(error => console.error('Error:', error));
}

// updating UI 
function setUIState() {
    modallabel.innerText = "Add Student Record"
    modalformsubmitbtn.innerText = 'Add Student'
    const tablesrows = Array.from(datatablesSimple.lastElementChild.children);
    if (tablesrows.length === 1 && tablesrows[0].firstElementChild.innerText === 'No entries found') {
        removestudentsactionbtn.classList.add('d-none')
        removeallstudentactionbtn.classList.add('d-none')
    } else {
        removestudentsactionbtn.classList.remove('d-none')
        removeallstudentactionbtn.classList.remove('d-none')
        tablesrows.forEach((row) => {
            row.classList.remove('is-edit');
            const checkbox = row.firstElementChild.firstElementChild;
            checkbox.checked = false;
        })
    }
    rowstoremove = [];
    studentidtoremove = [];
}

// set the mode to isedit = true and peforming some actions
function changemode(target) {
    isedit = true
    const tablerow = target.closest('tr')
    tablerow.classList.add('is-edit')
    const studentnameinput = addandeditstudentdetailform.querySelector('#student_name')
    studentnameinput.value = tablerow.firstElementChild.nextElementSibling.innerText
    const studentsexinput = addandeditstudentdetailform.querySelector('#Student_sex')
    studentsexinput.value = tablerow.lastElementChild.innerText
    modallabel.innerText = "Update Student's data"
    modalformsubmitbtn.innerText = 'update record'
    $(addandeditstudentdetailModal).modal('show');
}

// Add or Input Form Submission Validation
function processform(e) {
    e.preventDefault();
    if (addandeditstudentdetailform.checkValidity() === false) {
        addandeditstudentdetailform.classList.add('was-validated');
    } else {
        addandeditstudentdetailform.classList.remove('was-validated');
        if (isedit) {
            submitupdateformdetails()
        } else {
            submitformdetails()
        }
        
    }
}

// updating old student record
function submitupdateformdetails(){
    const edittablerow = document.querySelector('tr.is-edit');
    const studentID = edittablerow.firstElementChild.firstElementChild.value;
    const studentname_input = addandeditstudentdetailform.querySelector('#student_name')
    const studentname = studentname_input.value
    const Student_sex_input = addandeditstudentdetailform.querySelector('#Student_sex')
    const Student_sex = Student_sex_input.value
    dataTable.rows.remove(parseInt(rowToRemove.dataset.index))
    submitupdatetoServer(+studentID, studentname, Student_sex);
    studentname_input.value = ''
    Student_sex_input.value = ''
    $(addandeditstudentdetailModal).modal('hide');
    isedit = false
    setUIState()
}

function submitupdatetoServer(studentID,studentname, Student_sex) {
    const updatestudentdata = {
        studentID,
        studentclass,
        studentname,
        Student_sex
    }
    fetch(`/TeachersPortal/updateStudent/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(updatestudentdata)
    })
        .then(response => response.json())
        .then(data => {
            const student_ID = data['student_ID']
            const student_name = data['student_name']
            const student_id = data['student_id']
            const student_sex = data['student_sex']
            adddetailstoDOM(student_ID, student_name, student_id, student_sex)
            const type = 'alert-success'
            const message = data['message']
            displayalert(type, message)
        })
        .catch(error => console.error('Error:', error));
}

// submitting new student record
async function submitformdetails() {
    const studentname_input = addandeditstudentdetailform.querySelector('#student_name')
    const studentname = studentname_input.value
    const Student_sex_input = addandeditstudentdetailform.querySelector('#Student_sex')
    const Student_sex = Student_sex_input.value
    await submittoServer(studentname, Student_sex);
    spinner.classList.add('.d-none')
    studentname_input.value = ''
    Student_sex_input.value = ''
    $(addandeditstudentdetailModal).modal('hide');
}

async function submittoServer(studentname, Student_sex) {
    spinner.classList.remove('.d-none')
    const studentdata = {
        studentclass,
        studentname,
        Student_sex
    }
    const response = await fetch(`/TeachersPortal/newStudent/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(studentdata)
    })
    const data = await response.json()
        const student_ID = data['student_ID']
        const student_name = data['student_name']
        const student_id = data['student_id']
        const student_sex = data['student_sex']
        adddetailstoDOM(student_ID, student_name, student_id, student_sex)
        const type = 'alert-success'
        const message = data['message']
        displayalert(type, message)
}

// add a new row to the datatable
function adddetailstoDOM(student_ID, studentname, student_id, Student_sex) {
    let newRow = [
        `<input class="form-check-input me-3" type="checkbox" value="${student_ID}" id="selectstudentcheckbox">`,
        `<a class="editstudentinfo text-decoration-none" data-bs-toggle="modal" data-bs-target="#AddandeditStudentModal" style="cursor:pointer">${studentname}</a>`,
        `${student_id}`,
        `${Student_sex}`
    ];
    dataTable.rows.add(newRow);
    dataTable.refresh()
}

// Closing the Modal by clicking the Modal button
addandeditstudentdetailModal.addEventListener('hidden.bs.modal', function () {
    const studentname_input = addandeditstudentdetailform.querySelector('#student_name')
    const studentname = studentname_input.value
    const Student_sex_input = addandeditstudentdetailform.querySelector('#Student_sex')
    const Student_sex = Student_sex_input.value
    studentname_input.value = ''
    Student_sex_input.value = ''
    addandeditstudentdetailform.classList.remove('was-validated');
    setUIState()
});

// display Alert System
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
    
