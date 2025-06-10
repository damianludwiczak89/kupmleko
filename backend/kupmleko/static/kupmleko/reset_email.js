  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const submit_button = document.querySelector("button");



    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Password changed successfully.");
        submit_button.disabled = true;
        setTimeout(() => {
          window.close();  // Optionally close the tab/window
        }, 3000);
      } else {
        alert(result.message || "Something went wrong.");
      }
    });
  });