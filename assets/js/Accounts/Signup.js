    
const togglePassword1 = document.querySelector('.toggle-password1');
const passwordInput = document.querySelector('input[name="password1"]');
const passwordInput1 = document.querySelector('input[name="password1"]');
const confirmPasswordInput1 = document.querySelector('input[name="password2"]');
const signUpButton = document.getElementById('submit-btn');
const errorText = document.getElementById('error-text');
const groupselect = document.getElementById('Groupname');
const classselect = document.getElementById('Classname');


// JavaScript code to toggle the show Password 1 button
togglePassword1.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    const eyeIcon = togglePassword1.querySelector('i.fa-solid');
    eyeIcon.classList.toggle('fa-eye');
    eyeIcon.classList.toggle('fa-eye-slash');
});

// JavaScript code to toggle the show Password 2 button
const togglePassword2 = document.querySelector('.toggle-password2');
const confirmPasswordInput = document.querySelector('input[name="password2"]');

togglePassword2.addEventListener('click', function () {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);

    const eyeIcon = togglePassword2.querySelector('i.fa-solid');
    eyeIcon.classList.toggle('fa-eye');
    eyeIcon.classList.toggle('fa-eye-slash');
});


// Code to show if input Value matches
function checkPasswordMatch(){
    const password = passwordInput1.value;
    const confirmPassword = confirmPasswordInput1.value;

    if (password !== confirmPassword) {
        signUpButton.disabled = true;
        errorText.style.display = 'block';
    } else {
        signUpButton.disabled = false;
        errorText.style.display = 'none';
    }
};

confirmPasswordInput1.addEventListener('input', checkPasswordMatch);
    

// Code to display the Class Select Box
function revealSelectClass(e){
    if (e.target.value === 'Formteacher') {
        classselect.querySelector('select').setAttribute('required','')
        classselect.style.display='block'
    } else {
        classselect.querySelector('select').removeAttribute('required')
        classselect.style.display='none'
    }
};

groupselect.addEventListener('input', revealSelectClass);

    

