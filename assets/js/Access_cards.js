const download_btn = document.getElementById('download_btn');
const spinner = download_btn.querySelector('.spinner-border');
const student_card_container = document.getElementById('student_card_container');
const download_back_btn = document.getElementById('download_back_btn');
const spinner2 = download_back_btn.querySelector('.spinner-border');
const student_card_back_container = document.getElementById('student_card_back_container');
let element = student_card_container

download_btn.addEventListener('click', () => {
    // Show spinner
    spinner.classList.remove('d-none');
    download_btn.disabled = true;
    // Call the function that generates the PDF
    element = student_card_container;
    myFunction()
      .then(() => {
        // PDF generation is finished, stop spinner
        spinner.classList.add('d-none');
        download_btn.disabled = false;
        // Add your code to start downloading the PDF here
      })
      .catch((error) => {
        // PDF generation encountered an error, display error message
        spinner.classList.add('d-none');
        download_btn.disabled = false;
        download_btn.innerHTML = 'Error: ' + error.message;
      });
  });
  
// event listener for the Back Card

download_back_btn.addEventListener('click', () => {
    // Show spinner
    spinner2.classList.remove('d-none');
    download_back_btn.disabled = true;
    // Call the function that generates the PDF
    element = student_card_back_container;
    myFunction()
      .then(() => {
        // PDF generation is finished, stop spinner
        spinner2.classList.add('d-none');
        download_back_btn.disabled = false;
        // Add your code to start downloading the PDF here
      })
      .catch((error) => {
        // PDF generation encountered an error, display error message
        spinner2.classList.add('d-none');
        download_back_btn.disabled = false;
        download_back_btn.innerHTML = 'Error: ' + error.message;
      });
  });


  function myFunction(e){
        var opt =
        {
            margin: [0,0],
            filename: 'SMSS Access Cards' + '.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { 
              scale: 5,
              width: element.offsetWidth,
              height: element.offsetHeight,
              useCORS: true,
            },
            jsPDF: { unit: 'px', format: [element.offsetWidth, element.offsetHeight], orientation: 'Portrait', hotfixes : ["px_scaling"] }
        };
        // New Promise-based usage:
        return new Promise((resolve, reject) => {
            html2pdf().set(opt).from(element).save()
            .then(() => {
                // PDF generation is complete, resolve the promise
                resolve();
              })
              .catch((error) => {
                // PDF generation encountered an error, reject the promise with the error
                reject(error);
              });
          });
    }