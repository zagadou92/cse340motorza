document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("pwd-visibility");

  if (passwordInput && togglePasswordBtn) {
    const togglePassword = () => {
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
    };

    togglePasswordBtn.addEventListener("click", togglePassword);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const logoutLink = document.querySelector('a[href="/logout"]');
  if (logoutLink) {
    logoutLink.addEventListener("click", function (event) {
      event.preventDefault();
      fetch("/logout", {
        method: "POST",
        credentials: "same-origin",
      })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/";
          } else {
            console.error("Error logout");
          }
        })
        .catch((error) => {
          console.error("Error logout:", error);
        });
    });
  }
});