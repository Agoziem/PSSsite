const togglePassword1 = document.querySelector('.toggle-password');
        const passwordInput = document.querySelector('input[name="password"]');

        togglePassword1.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const eyeIcon = togglePassword1.querySelector('i.fa-solid');
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });