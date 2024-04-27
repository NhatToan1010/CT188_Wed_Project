let iconCart = document.querySelector(".icon-cart");
let btnBack = document.getElementById("btnBack");
let checkOut = document.getElementById("btnCheck");
let body = document.querySelector("body");
let listProductHTML = document.querySelector(".listProducts");
let listCartHTML = document.querySelector(".listCart");
let iconCartSpan = document.querySelector(".icon-cart span");

let listProducts = [];
let carts = [];

const addData = () => {
  listProductHTML.innerHTML = "";
  if (listProducts.length > 0) {
    listProducts.forEach((item) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("item");
      newProduct.dataset.id = item.id;
      newProduct.innerHTML = `
        <img src="${item.image}" />
        <h2>${item.name}</h2>
        <div class="price">$${item.price}</div>
        <button class="addCart">Add to Cart</button>`;
      listProductHTML.appendChild(newProduct);
    });
  }
};

const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;
      let thisProduct = listProducts.findIndex(
        (value) => value.id == cart.product_id
      );
      let productInfo = listProducts[thisProduct];
      newCart.innerHTML = `
          <div class="image">
            <img src="${productInfo.image}" alt="${productInfo.name}"/>
          </div>
          <div class="name">${productInfo.name}</div>
          <div class="totalPrice">${productInfo.price * cart.quantity}</div>
          <div class="quantity">
            <span class="minus"><</span>
            <span>${cart.quantity}</span>
            <span class="plus">></span>
          </div>`;
      listCartHTML.appendChild(newCart);
    });
  }
  iconCartSpan.innerText = totalQuantity;
};

const tempSaveCartItem = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

const addToCart = (product_id) => {
  let thisProduct = carts.findIndex((value) => value.product_id == product_id);
  if (carts.length <= 0) {
    carts = [{ product_id: product_id, quantity: 1 }];
  } else if (thisProduct < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[thisProduct].quantity += 1;
  }
  addCartToHTML();
  tempSaveCartItem();
};

const changeQuantity = (product_id, type) => {
  let positionItem = carts.findIndex((value) => value.product_id == product_id);
  if (positionItem >= 0) {
    switch (type) {
      case "plus":
        carts[positionItem].quantity += 1;
        break;
      default:
        let valueChange = carts[positionItem].quantity - 1;
        if (valueChange > 0) {
          carts[positionItem].quantity = valueChange;
        } else {
          carts.splice(positionItem, 1);
        }
        break;
    }
  }
  tempSaveCartItem();
  addCartToHTML();
};

const getCartFromMemory = () => {
  if (localStorage.getItem("cart")) {
    carts = JSON.parse(localStorage.getItem("cart"));
    addCartToHTML();
  }
};

const checkPrice = () => {
  carts.innerHTML = "";
  let totalPrice = 0;
  let discount = 0.25;
  let priceReduced = 0;
  let count = 0;
  carts.forEach((cart) => {
    let thisProduct = listProducts.findIndex(
      (value) => value.id == cart.product_id
    );
    let productInfo = listProducts[thisProduct];
    totalPrice += productInfo.price * cart.quantity;
    count += cart.quantity;
  });
  if (count <= 5) {
    alert("Your total price to pay is: $" + totalPrice.toFixed(2));
  } else {
    priceReduced = totalPrice - totalPrice * discount;
    alert(
      "Your total price to pay is: $" +
        priceReduced.toFixed(2) +
        "\n(25% Discount)"
    );
  }
};

iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

btnBack.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

btnCheck.addEventListener("click", () => {
  checkPrice();
});

listProductHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("addCart")) {
    let product_id = positionClick.parentElement.dataset.id;
    addToCart(product_id);
  }
});

listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantity(product_id, type);
  }
});

const initApp = () => {
  // get data form product.json
  fetch("/data/product.json")
    .then((response) => response.json())
    .then((data) => {
      listProducts = data;
      addData();

      // get cart data from memory
      getCartFromMemory();
    });
};

initApp();
