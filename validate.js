
"use strict";

// Get form elements
const form = document.getElementById("registrationForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

const formMessage = document.getElementById("formMessage");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

// Track fields that the user has interacted with
const touched = new Set();

const fields = [
  fullName,
  email,
  phone,
  password,
  confirmPassword
];

const errorIds = {
  fullName: "nameError",
  email: "emailError",
  phone: "phoneError",
  password: "passwordError",
  confirmPassword: "confirmPasswordError"
};

// Password requirement elements
const rules = {
  length: document.getElementById("ruleLength"),
  upper: document.getElementById("ruleUpper"),
  number: document.getElementById("ruleNumber"),
  special: document.getElementById("ruleSpecial")
};

// Display or clear a field error
function showError(field, message) {
  const errorElement = document.getElementById(errorIds[field.id]);

  field.classList.remove("valid");
  field.classList.add("invalid");
  field.setAttribute("aria-invalid", "true");
  errorElement.textContent = "⚠ " + message;
}

function showValid(field) {
  const errorElement = document.getElementById(errorIds[field.id]);

  field.classList.remove("invalid");
  field.classList.add("valid");
  field.setAttribute("aria-invalid", "false");
  errorElement.textContent = "";
}

// Validate name
function validateName() {
  const value = fullName.value.trim();

  if (value === "") {
    showError(fullName, "Please enter your full name.");
    return false;
  }

  if (value.length < 2) {
    showError(fullName, "Name must contain at least 2 characters.");
    return false;
  }

  if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(value)) {
    showError(fullName, "Use letters, spaces, apostrophes or hyphens only.");
    return false;
  }

  showValid(fullName);
  return true;
}

// Validate email address
function validateEmail() {
  const value = email.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (value === "") {
    showError(email, "Please enter your email address.");
    return false;
  }

  if (!emailPattern.test(value)) {
    showError(email, "Enter a valid email, such as name@example.com.");
    return false;
  }

  showValid(email);
  return true;
}

// Validate phone number
function validatePhone() {
  const value = phone.value.trim();

  if (value === "") {
    showError(phone, "Please enter your phone number.");
    return false;
  }

  if (!/^[6-9]\d{9}$/.test(value)) {
    showError(phone, "Enter a valid 10-digit Indian mobile number.");
    return false;
  }

  showValid(phone);
  return true;
}

// Check password rules
function checkPasswordRules() {
  const value = password.value;

  const checks = {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value)
  };

  Object.keys(checks).forEach(function (key) {
    rules[key].classList.toggle("passed", checks[key]);
    rules[key].textContent =
      (checks[key] ? "✓ " : "○ ") +
      {
        length: "8+ characters",
        upper: "Uppercase letter",
        number: "One number",
        special: "Special character"
      }[key];
  });

  const score = Object.values(checks).filter(Boolean).length;
  strengthBar.style.width = (score * 25) + "%";

  const colors = ["#d9384e", "#ef8c43", "#e5bb39", "#3979e8", "#16a784"];
  strengthBar.style.background = colors[score];

  const labels = [
    "Not entered",
    "Weak",
    "Fair",
    "Good",
    "Strong"
  ];

  strengthText.textContent = "Password strength: " + labels[score];

  return Object.values(checks).every(Boolean);
}

// Validate password
function validatePassword() {
  const value = password.value;

  if (value === "") {
    showError(password, "Please create a password.");
    return false;
  }

  if (!checkPasswordRules()) {
    showError(
      password,
      "Password must meet all four requirements listed above."
    );
    return false;
  }

  showValid(password);
  return true;
}

// Validate confirmation
function validateConfirmPassword() {
  if (confirmPassword.value === "") {
    showError(confirmPassword, "Please confirm your password.");
    return false;
  }

  if (confirmPassword.value !== password.value) {
    showError(confirmPassword, "Passwords do not match. Try again.");
    return false;
  }

  showValid(confirmPassword);
  return true;
}

// Validate terms checkbox
function validateTerms() {
  const termsError = document.getElementById("termsError");

  if (!terms.checked) {
    termsError.textContent =
      "⚠ Please agree to the terms and conditions.";
    terms.setAttribute("aria-invalid", "true");
    return false;
  }

  termsError.textContent = "";
  terms.setAttribute("aria-invalid", "false");
  return true;
}

// Run the correct validator for a field
function validateField(field) {
  switch (field.id) {
    case "fullName":
      return validateName();

    case "email":
      return validateEmail();

    case "phone":
      return validatePhone();

    case "password":
      return validatePassword();

    case "confirmPassword":
      return validateConfirmPassword();

    default:
      return true;
  }
}

// Update progress using successfully completed fields
function updateProgress() {
  const completedFields = fields.filter(function (field) {
    return field.value.trim() !== "" &&
      field.classList.contains("valid");
  }).length;

  const totalCompleted = completedFields + (terms.checked ? 1 : 0);
  const percentage = Math.round((totalCompleted / 6) * 100);

  progressBar.style.width = percentage + "%";
  progressText.textContent = percentage + "% completed";
}

// Clear the overall message
function clearFormMessage() {
  formMessage.textContent = "";
  formMessage.className = "form-message";
}

// Connect every text field to live validation
fields.forEach(function (field) {
  field.addEventListener("blur", function () {
    touched.add(field.id);
    validateField(field);
    updateProgress();
  });

  field.addEventListener("input", function () {
    clearFormMessage();

    // Show errors live after the user first interacts with a field
    if (touched.has(field.id)) {
      validateField(field);
    }

    // Password changes can affect the confirmation field
    if (field === password) {
      checkPasswordRules();

      if (touched.has("confirmPassword")) {
        validateConfirmPassword();
      }
    }

    updateProgress();
  });
});

// Show/hide password buttons
document.querySelectorAll(".toggle-password").forEach(function (button) {
  button.addEventListener("click", function () {
    const target = document.getElementById(button.dataset.target);
    const shouldShow = target.type === "password";

    target.type = shouldShow ? "text" : "password";
    button.textContent = shouldShow ? "Hide" : "Show";
    button.setAttribute(
      "aria-label",
      shouldShow ? "Hide password" : "Show password"
    );
  });
});

// Terms checkbox interaction
terms.addEventListener("change", function () {
  clearFormMessage();

  if (touched.has("terms") || terms.checked) {
    touched.add("terms");
    validateTerms();
  }

  updateProgress();
});

// SUBMIT FORM
form.addEventListener("submit", function (event) {
  // Stop the page from reloading
  event.preventDefault();

  clearFormMessage();

  // Validate every field, even if the user skipped it
  fields.forEach(function (field) {
    touched.add(field.id);
  });

  touched.add("terms");

  const results = [
    validateName(),
    validateEmail(),
    validatePhone(),
    validatePassword(),
    validateConfirmPassword(),
    validateTerms()
  ];

  updateProgress();

  // If any field is incorrect, display an error
  if (results.includes(false)) {
    formMessage.textContent =
      "❌ Form contains errors. Please correct the highlighted fields and try again.";

    formMessage.classList.add("show", "error-message");

    // Focus the first incorrect field
    const firstInvalid = fields.find(function (field) {
      return field.classList.contains("invalid");
    });

    if (firstInvalid) {
      firstInvalid.focus();
    } else if (!terms.checked) {
      terms.focus();
    }

    formMessage.focus();
    return;
  }

  // All validations passed
  formMessage.textContent =
    "✅ Registration successful! All details have been validated.";

  formMessage.classList.add("show", "success-message");
  formMessage.focus();

  // This is a front-end demonstration, not a real account registration.
});

// RESET FORM
form.addEventListener("reset", function () {
  // Let the browser reset the fields first
  setTimeout(function () {
    touched.clear();

    fields.forEach(function (field) {
      field.classList.remove("valid", "invalid");
      field.removeAttribute("aria-invalid");
    });

    Object.values(errorIds).forEach(function (id) {
      document.getElementById(id).textContent = "";
    });

    document.getElementById("termsError").textContent = "";

    Object.values(rules).forEach(function (rule) {
      rule.classList.remove("passed");
    });

    rules.length.textContent = "○ 8+ characters";
    rules.upper.textContent = "○ Uppercase letter";
    rules.number.textContent = "○ One number";
    rules.special.textContent = "○ Special character";

    strengthBar.style.width = "0%";
    strengthBar.style.background = "";
    strengthText.textContent = "Password strength: not entered";

    document.querySelectorAll(".toggle-password").forEach(function (button) {
      button.textContent = "Show";
      button.setAttribute("aria-label", "Show password");
    });

    progressBar.style.width = "0%";
    progressText.textContent = "0% completed";

    clearFormMessage();
  }, 0);
});
