// UI Elements for Results
const selectedclass = document.getElementById("school_classes");
const studentclassholder = document.getElementById("studentclassholder");
const selctedstudentclass =
  selectedclass.options[selectedclass.selectedIndex].value;
studentclassholder.innerText = selctedstudentclass;
const selectedsession = document.getElementById("session");
const selectedterm = document.getElementById("term");

const resultcredentialform = document.getElementById("resultcredentialform");
const subjectpublished = document.getElementById("subjectpublished");
const classresultpublishedbadge = document.getElementById(
  "classresultpublishedbadge"
);
const Publishedcounter = document.getElementById("Publishedcounter");

// Event Listeners ///////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  loadresultcredentials();
  selectedclass.addEventListener("change", (e) => {
    studentclassholder.innerText = e.target.value;
    setresultcredentials(e);
  });
  selectedsession.addEventListener("change", (e) => {
    setresultcredentials(e);
  });
  selectedterm.addEventListener("change", (e) => {
    setresultcredentials(e);
  });

  resultcredentialform.addEventListener("submit", (e) => {
    e.preventDefault();
    getClassPublishedResults();
  });
});

/////////////////////////////////////////
// initails states
let resultcredentials = {
  classname: "",
  session: "",
  term: "",
};

// functions //////////////////////////
// load result credentials from Local Storage if its there or set it to the initial state
const loadresultcredentials = () => {
  if (localStorage.getItem("resultcredentials")) {
    resultcredentials = JSON.parse(localStorage.getItem("resultcredentials"));
    selectedclass.value = resultcredentials.classname;
    selectedsession.value = resultcredentials.session;
    selectedterm.value = resultcredentials.term;
    resultcredentials.classname !== "" &&
      resultcredentials.session !== "" &&
      resultcredentials.term !== "" &&
      getClassPublishedResults();
  } else {
    resultcredentials.classname =
      selectedclass.options[selectedclass.selectedIndex].value;
    resultcredentials.session =
      selectedsession.options[selectedsession.selectedIndex].value;
    resultcredentials.term =
      selectedterm.options[selectedterm.selectedIndex].value;
    resultcredentials.classname !== "" &&
      resultcredentials.session !== "" &&
      resultcredentials.term !== "" &&
      getClassPublishedResults();
  }
};

// function to set the result credentials
const setresultcredentials = (e) => {
  resultcredentials = {
    ...resultcredentials,
    [e.target.name]: e.target.value,
  };
  localStorage.setItem("resultcredentials", JSON.stringify(resultcredentials));
};

// function to get Class Published Results
const getClassPublishedResults = async () => {
  try {
    const response = await fetch("/TeachersPortal/getclasspublishedResults/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(resultcredentials),
    });
    const data = await response.json();
    if (response.ok) {
      displayResultPublishedbadge(data);
      displaypublishedResult(data);
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.log(error);
  }
};

// function to dissplay it in the UI
function displayResultPublishedbadge(data) {
  classresultpublishedbadge.innerHTML = data.published
    ? `<i class="fa-solid fa-check-circle me-2"></i>
       Result Published`
    : `<i class="fa-solid fa-circle-plus me-2"></i>
       Result Not Published`;
  data.published
    ? classresultpublishedbadge.classList.replace("bg-secondary", "bg-success")
    : classresultpublishedbadge.classList.replace("bg-success", "bg-secondary");
}

function displaypublishedResult(data) {
  if (data.subjects && data.subjects.length > 0) {
    subjectpublished.innerHTML = data.subjects
      .map((subject, index) => {
        if (subject.published) {
          return `<li class="list-group-item d-flex justify-content-between align-items-center fw-bold text-success">
                    <span>
                        <span class="me-2">${index + 1}.</i>
                        ${subject.subject}
                    </span>
                    
                  <i class="fa-solid fa-check-double"></i>
                </li>`;
        } else {
          return `<li class="list-group-item d-flex justify-content-between align-items-center fw-bold text-danger">
                    <span>
                        <span class="me-2">${index + 1}.</i>
                        ${subject.subject}
                    </span>
                    <i class="fa-solid fa-xmark"></i>
                  </li>`;
        }
      })
      .join("");
    const totalresultspublished = data.subjects.filter(
      (subject) => subject.published
    ).length;
    const totalresults = data.subjects.length;
    Publishedcounter.innerHTML =
      totalresultspublished === totalresults
        ? `<span class="text-success fw-bold ">Completed</span>`
        : `
      <span class="fw-bold text-success ">${totalresultspublished}</span> out of <span class="fw-bold text-success">${totalresults}</span> Subject Teachers have Published
        `;
  } else {
    subjectpublished.innerHTML = `<li class="list-group-item d-flex justify-content-between align-items-center fw-bold text-danger">
                    <span>
                        <i class="fa-solid fa-xmark me-2"></i>
                        No Result Published Yet for ${resultcredentials.classname} in ${resultcredentials.term} ${resultcredentials.session}
                    </span>
                  </li>`;
    Publishedcounter.innerHTML = "";
  }
}
