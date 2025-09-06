const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const submitBtn = document.getElementById("submitBtn");
const toast = document.getElementById("toast");

function showToast(message, ok = true) {
  toast.textContent = message;
  toast.style.display = "block";
  toast.style.background = ok ? "#d1fae5" : "#fee2e2";
  toast.style.borderColor = ok ? "#a7f3d0" : "#fecaca";
  toast.style.color = ok ? "#065f46" : "#7f1d1d";
  setTimeout(() => (toast.style.display = "none"), 2500);
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  emailError.textContent = "";
  passwordError.textContent = "";

  let valid = true;

  if (!email.value.trim()) {
    emailError.textContent = "Email is required.";
    valid = false;
  } else if (!validateEmail(email.value.trim())) {
    emailError.textContent = "Enter a valid email address.";
    valid = false;
  }

  if (!password.value.trim()) {
    passwordError.textContent = "Password is required.";
    valid = false;
  } else if (password.value.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters.";
    valid = false;
  }

  if (!valid) {
    showToast("Please fix the errors above.", false);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Logging in...";

  // Simulate an API call; replace with real fetch later
  await new Promise((res) => setTimeout(res, 900));

  showToast("Login successful!");
  submitBtn.disabled = false;
  submitBtn.textContent = "Login";

  // Example redirect after success:
  // window.location.href = "/dashboard.html";
});
