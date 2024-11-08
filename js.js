const modal = document.querySelector(".modal");
const basket = document.querySelector("#a");
const box = document.querySelector(".wrapper");
let cart = [];
let savat = JSON.parse(localStorage.getItem("qishkiKiyimlar")) || [];
const deleteIcon = "./images/icons8-delete-100 (1).png";

fetch("https://61fcfec8f62e220017ce4280.mockapi.io/kiyim-kechak/qishkiKiyimlar")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((json) => {
    localStorage.setItem("qishkiKiyimlar", JSON.stringify(json));
    savat = json;
    displayData(savat); // Ma'lumotlarni ekranda ko'rsatish
  })
  .catch((error) => console.error("Error fetching data:", error));

let isModalOpen = false;

basket.addEventListener("click", () => {
  if (isModalOpen) {
    modal.style.transform = "translateX(430px)";
  } else {
    modal.style.transform = "translateX(0px)";
    displayCart();
  }
  isModalOpen = !isModalOpen;
});

function add(index) {
  const savatdata = JSON.parse(localStorage.getItem("newdata")) || [];
  const selectedItem = savat[index];

  const existingItemIndex = savatdata.findIndex(
    (item) => item.id === selectedItem.id
  );

  if (existingItemIndex > -1) {
    savatdata[existingItemIndex].quantity++;
  } else {
    selectedItem.quantity = 1;
    savatdata.push(selectedItem);
  }

  localStorage.setItem("newdata", JSON.stringify(savatdata));
  displayCart();
  showToast("The product has been added to the cart");
}

function showToast(message) {
  const tostify = document.getElementById("tostify");
  tostify.textContent = message;
  tostify.classList.add("show");
  tostify.classList.remove("hidden");

  setTimeout(() => {
    tostify.classList.remove("show");
    tostify.classList.add("hidden");
  }, 1500);
}

function displayCart() {
  const cartContainer = document.querySelector(".cart-items");
  cartContainer.innerHTML = "";

  const storedCartItems = JSON.parse(localStorage.getItem("newdata")) || [];
  let totalPrice = 0;

  storedCartItems.forEach((item) => {
    const itemDiv = document.createElement("div");

    totalPrice += item.price * item.quantity;

    itemDiv.innerHTML = `
      <div class="text">
        <img src="${item.avatar}" />
        <h3>${item.name}</h3>
        <p class="f"> $${(item.price * item.quantity).toFixed(2)}</p>
        <div class="al">
          <button onclick="decreaseQuantity('${item.id}')">-</button>
          <p class="nu"><span class="quantity">${item.quantity}</span></p>
          <button onclick="increaseQuantity('${item.id}')">+</button>
        </div>
      </div>
    `;
    cartContainer.appendChild(itemDiv);
  });

  const totalPriceDiv = document.createElement("div");
  totalPriceDiv.innerHTML = `<h2>Total Price: $${totalPrice.toFixed(2)}</h2>`;
  cartContainer.appendChild(totalPriceDiv);
}

window.increaseQuantity = function (id) {
  const savatdata = JSON.parse(localStorage.getItem("newdata")) || [];
  const item = savatdata.find((item) => item.id === id);
  if (item) {
    item.quantity++;
    localStorage.setItem("newdata", JSON.stringify(savatdata));
    displayCart();
  }
};

window.decreaseQuantity = function (id) {
  const savatdata = JSON.parse(localStorage.getItem("newdata")) || [];
  const item = savatdata.find((item) => item.id === id);
  if (item) {
    if (item.quantity > 1) {
      item.quantity--;
      localStorage.setItem("newdata", JSON.stringify(savatdata));
      displayCart();
    } else {
      deleteItem(id);
    }
  }
};

function deleteItem(id) {
  let savatdata = JSON.parse(localStorage.getItem("newdata")) || [];
  savatdata = savatdata.filter((item) => item.id !== id);
  localStorage.setItem("newdata", JSON.stringify(savatdata));
  if (confirm("Are you sure you want to delete the product?")) {
    displayCart();
  }
}

function displayData(data) {
  box.innerHTML = ""; // Oldingi natijalarni tozalash

  data.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    itemDiv.innerHTML = `
      <span>${item.price} $</span>
      <span>${item.count}</span>
      <h1>Food-Manager <span>🍴</span></h1>
      <img src="${item.avatar}"/>
      <h3>${item.name}</h3>
      <h2>⭐⭐⭐⭐⭐</h2>
      <p>Price: $${item.price}</p>
      <button onclick="add(${index})">Add</button>
    `;

    box.appendChild(itemDiv);
  });
}

document.getElementById("searchInput").addEventListener("input", function (event) {
  const searchText = event.target.value.toLowerCase();
  const filteredData = savat.filter((item) =>
    item.name.toLowerCase().includes(searchText)
  );
  displayData(filteredData);
});
