const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // POST para cargar imagen
  const formData = new FormData(form);
  const response = await fetch("/images", {
    method: "POST",
    body: formData,
  });

  const { url } = await response.json();
  if (url) {
    return window.open(`http://localhost:8080/${url}`, "_blank");
  } else {
    return alert("No se ha recibido la URL de la imagen");
  }
});
