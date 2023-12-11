const productList = document.querySelector("ul");
const validMemberMessage = document.getElementById("validMemberMessage");
const initialize = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const lastAttemptedUsername = urlParams.get("lastAttemptedUsername");
  if (lastAttemptedUsername) {
    validMemberMessage.textContent = `Username: ${lastAttemptedUsername} es inválido. Ingrese uno de los siguientes: "admin", "lupo", "pepe"`;
  }

  const response = await fetch("/api/products");
  const products = await response.json();

  productList.innerHTML = "";
  for (const product of products) {
    const li = document.createElement("li");
    li.innerHTML = `${product?.title}: ${product?.price}`;
    productList?.appendChild(li);
  }
};

initialize();
