import StudentDataHandler from "./utils/StudentResulthandler.js";
import {
  getstudentdata,
  updatestudentresult,
  submitallstudentresult,
} from "./serveractions.js";

import DataTable from "./datatables/studentDatatable.js";

// Result UI elements ///////////////////////////////////////////////
const getstudentresultform = document.querySelector("#getstudentresultform");
const classinput = getstudentresultform.querySelector("input");
const termSelect = document.getElementById("termSelect");
const subjectselect = getstudentresultform.querySelector("select");
const Examforminput = document.querySelector(".Examinput");
const academicSessionSelect = document.getElementById("academicSessionSelect");
const rowcheckboxes = document.querySelector(".rowgroup");
const inputStudentResultModal = document.querySelector(
  "#inputStudentResultModal"
);
const inputform = inputStudentResultModal.querySelector(
  "#inputStudentResultform"
);
const alertcontainer = document.querySelector(".alertcontainer");

// Event Listeners //////////////////////////////////////////////////////////////////
document.querySelectorAll(".publishbtn").forEach((btn) => {
  btn.addEventListener("click", publishResultData);
});

document.addEventListener("DOMContentLoaded", () => {
  loadResultCredentials();

  getstudentresultform.addEventListener("submit", (e) => {
    e.preventDefault();
    saveResultCredentials();
  });

  document
    .getElementById("inputStudentResultform")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(inputform);
      const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      classdata.studentsubject =
        subjectselect.options[subjectselect.selectedIndex].value;
      (classdata.selectedTerm = termSelect.value),
        (classdata.selectedAcademicSession = academicSessionSelect.value),
        updatestudentresult(
          formDataObject,
          classdata,
          fetchdataandpopulatetable,
          displayalert
        );
      $(inputStudentResultModal).modal("hide");
    });
});

// initial states //////////////////////////////////////////////////////////////////
let classdata = {
  studentclass: classinput.value,
};
let studentResult = [];
let state;

// Functions ///////////////////////////////////////////////////////////////////////
// Function to display alert messages
function displayalert(type, message) {
  const alertdiv = document.createElement("div");
  alertdiv.classList.add(
    "alert",
    `${type}`,
    "d-flex",
    "align-items-center",
    "mt-3"
  );
  alertdiv.setAttribute("role", "alert");
  alertdiv.innerHTML = `
                        <i class="fa-solid fa-circle-check me-2"></i>
                        <div>
                           ${message}
                        </div>
                        `;
  alertcontainer.appendChild(alertdiv);

  setTimeout(() => {
    alertdiv.remove();
  }, 3000);
}

// Function to save selected values to localStorage
function saveResultCredentials() {
  localStorage.setItem("selectedresultTerm", termSelect.value);
  localStorage.setItem(
    "selectedresultAcademicSession",
    academicSessionSelect.value
  );
  localStorage.setItem("selectedresultsubject", subjectselect.value);
  classdata.selectedTerm = termSelect.value;
  classdata.selectedAcademicSession = academicSessionSelect.value;
  classdata.studentsubject =
    subjectselect.options[subjectselect.selectedIndex].value;

  // check whether the subject is Moral to adjust the Exam input Restrictions
  if (subjectselect.value === "Moral instruction") {
    Examforminput.innerHTML = "";
    Examforminput.innerHTML = `
                            <label for="Exam" class="form-label">Exam Score (100)</label>
                            <input type="number" class="form-control" id="Exam" name="Exam" min="0" max="100">`;
  } else {
    Examforminput.innerHTML = "";
    Examforminput.innerHTML = `
                            <label for="Exam" class="form-label">Exam Score (60)</label>
                            <input type="number" class="form-control" id="Exam" name="Exam" min="0" max="60">`;
  }
  fetchdataandpopulatetable();
}

// Function to load saved result credentials from localStorage
function loadResultCredentials() {
  const savedTerm = localStorage.getItem("selectedresultTerm");
  const savedAcademicSession = localStorage.getItem(
    "selectedresultAcademicSession"
  );
  const savedsubject = localStorage.getItem("selectedresultsubject");

  if (savedTerm !== null) {
    termSelect.value = savedTerm;
    classdata.selectedTerm = termSelect.value;
  } else {
    classdata.selectedTerm = termSelect.value;
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
  if (subjectselect.value === "Moral instruction") {
    Examforminput.innerHTML = "";
    Examforminput.innerHTML = `
                            <label for="Exam" class="form-label">Exam Score (100)</label>
                            <input type="number" class="form-control" id="Exam" name="Exam" min="0" max="100">`;
  } else {
    Examforminput.innerHTML = "";
    Examforminput.innerHTML = `
                            <label for="Exam" class="form-label">Exam Score (60)</label>
                            <input type="number" class="form-control" id="Exam" name="Exam" min="0" max="60">`;
  }

  fetchdataandpopulatetable();
}

// fecth the student data from the server and populate the table
async function fetchdataandpopulatetable() {
  try {
    const jsonData = await getstudentdata(classdata);
    const studentHandler = new StudentDataHandler(jsonData);
    const studentsWithCalculatedFields = studentHandler.getStudents();
    //   populaterowcheckbox(studentsWithCalculatedFields)
    studentResult = studentsWithCalculatedFields;
    updateResultBadge("update", studentsWithCalculatedFields[0]);
    populatetable(studentsWithCalculatedFields);
    const dataTable = new DataTable(inputStudentResultModal, inputform);
  } catch (error) {
    console.error("Error reading JSON file:", error);
  }
}

// function to export the table data to JSON and submit to the server
function publishResultData() {
  const url =
    state === "published"
      ? "/TeachersPortal/unpublishstudentresults/"
      : "/TeachersPortal/submitallstudentresult/";
  const datatosubmit = studentResult;
  classdata.studentsubject =
    subjectselect.options[subjectselect.selectedIndex].value;
  classdata.studentclass = classinput.value;
  (classdata.selectedTerm = termSelect.value),
    (classdata.selectedAcademicSession = academicSessionSelect.value),
    submitallstudentresult(url, datatosubmit, classdata, displayalert);
  updateResultBadge("setbadge", datatosubmit[0]);
}

// Function to populate the Table rows
function populatetable(tabledata) {
  const tbody = document.querySelector("#dataTable").lastElementChild;
  tbody.innerHTML = tabledata
    .map(
      (data, index) => `
        <tr data-rowindex='${index + 1}'>
            <td>${index + 1}</td>
            <td class="text-primary text-uppercase"><a class="inputdetailsformmodelbtn text-decoration-none" style="cursor:pointer">${
              data.Name
            }</a></td>
            <td>${data["1sttest"]}</td>
            <td>${data["1stAss"]}</td>
            <td>${data["MidTermTest"]}</td>
            <td>${data["Project"]}</td>
            <td>${data["2ndTest"]}</td>
            <td>${data["2ndAss"]}</td>
            <td>${data["CA"] || "-"}</td>
            <td>${data["Exam"]}</td> 
            <td>${data["Total"] || "-"}</td>
            <td>${data["Grade"] || "-"}</td>
            <td>${data["Position"] || "-"}</td>
            <td>${data["Remarks"] || "-"}</td>
            <td>${data["studentID"] || "-"}</td>
        </tr>`
    )
    .join("");
}

// function to update the result badge
function updateResultBadge(type, studentresult) {
  if (type === "setbadge") {
    studentresult.published = !studentresult.published;
  }
  state = studentresult.published ? "published" : "unpublished";
  const badge = document.querySelector("#resultbadge");
  studentresult.published
    ? badge.classList.replace("bg-secondary", "bg-success")
    : badge.classList.replace("bg-success", "bg-secondary");
  badge.innerHTML = studentresult.published
    ? `<i class="fa-solid fa-check-circle me-2"></i>
       Result Published`
    : `<i class="fa-solid fa-circle-plus me-2"></i>
       Result Not Published`;

  document.querySelectorAll(".publishbtn").forEach((btn) => {
    btn.innerHTML = studentresult.published
      ? `UnPublish Result <i class="fa-solid fa-right-from-bracket ms-2"></i>`
      : `Publish Result <i class='fa-solid fa-left-from-bracket ms-2'></i>`;
  });
}
