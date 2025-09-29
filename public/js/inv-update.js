document.addEventListener("DOMContentLoaded", () => {
  // Sélectionne tous les formulaires avec la classe spécifique
  const forms = document.querySelectorAll(".updateForm");

  // Itère sur chaque formulaire
  forms.forEach((form) => {
    form.addEventListener("change", function () {
      // Sélectionne le bouton à l'intérieur du formulaire
      const updateBtn = form.querySelector("button");
      if (updateBtn) {
        updateBtn.removeAttribute("disabled");
      }
    });
  });
});
