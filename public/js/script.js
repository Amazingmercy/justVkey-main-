


document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('resetPasswordForm');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const validationFeedback = document.getElementById('validationFeedback');
  const validationMessage = document.getElementById('validationMessage');

  // Function to show validation message
  function showValidationMessage(message, isError = true) {
    validationFeedback.classList.remove('d-none', 'alert-danger', 'alert-success');
    validationFeedback.classList.add(isError ? 'alert-danger' : 'alert-success');
    validationMessage.textContent = message;
  }

  // Function to validate password
  function validatePassword() {
    // Reset validation state
    password.classList.remove('is-invalid');
    confirmPassword.classList.remove('is-invalid');
    validationFeedback.classList.add('d-none');

    let isValid = true;

    // Check password length
    if (password.value.length < 8) {
      password.classList.add('is-invalid');
      showValidationMessage('Password must be at least 8 characters long.');
      isValid = false;
    }
    // Check if passwords match
    else if (password.value !== confirmPassword.value) {
      confirmPassword.classList.add('is-invalid');
      showValidationMessage('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  }

  // Real-time validation on input
  password.addEventListener('input', function () {
    if (password.value.length < 8) {
      password.classList.add('is-invalid');
      password.classList.remove('is-valid');
    } else {
      password.classList.remove('is-invalid');
      password.classList.add('is-valid');
      validationFeedback.classList.add('d-none');
    }
  });

  confirmPassword.addEventListener('input', function () {
    if (password.value !== confirmPassword.value) {
      confirmPassword.classList.add('is-invalid');
      confirmPassword.classList.remove('is-valid');
    } else {
      confirmPassword.classList.remove('is-invalid');
      confirmPassword.classList.add('is-valid');
      validationFeedback.classList.add('d-none');
    }
  });

  // Form submission validation
  form.addEventListener('submit', function (event) {
    if (!validatePassword()) {
      event.preventDefault();
    }
  });
});