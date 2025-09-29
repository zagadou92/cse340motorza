document.addEventListener("DOMContentLoaded", () => {
  // Toggle visibilité du mot de passe
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("pwd-visibility");

  if (passwordInput && togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
    });
  }

  // Gestion du lien logout
  const logoutLink = document.querySelector('a[href="/logout"]');
  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();
      fetch("/logout", {
        method: "POST",
        credentials: "same-origin",
      })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/";
          } else {
            console.error("Logout failed");
          }
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
    });
  }
});
