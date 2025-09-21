document.addEventListener("DOMContentLoaded", () => {
  // Selecciona todos los formularios con la clase específica
  const forms = document.querySelectorAll(".updateForm");

  // Itera sobre cada formulario
  forms.forEach((form) => {
    form.addEventListener("change", function () {
      // Selecciona el botón dentro del formulario que cambió
      const updateBtn = form.querySelector(".btn-account");
      if (updateBtn) {
        updateBtn.removeAttribute("disabled");
      }
    });
  });
});
