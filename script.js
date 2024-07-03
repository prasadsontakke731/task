

// Display Product Name
const displayProductName = function (vendor, title) {
    const vendorNameEl = document.createElement("span");
    vendorNameEl.classList.add("span-text");
    vendorNameEl.textContent = vendor;

    const productTitleEl = document.createElement("h3");
    productTitleEl.textContent = title;

    document
        .querySelector(".product__name-container")
        .append(vendorNameEl, productTitleEl);
};

// Display Product Price
const calculateDiscount = function (offer, original) {
    const discount = Math.floor(((original - offer) / original) * 100);
    return `${discount}% Off`;
};
const displayProductPrice = function (offer, original) {
    const offerPrice = Number(offer.split("$")[1]);
    const originalPrice = Number(original.split("$")[1]);
    const discountPercentage = calculateDiscount(offerPrice, originalPrice);

    const offerPriceEl = document.createElement("p");
    offerPriceEl.classList.add("discount-price");
    offerPriceEl.textContent = `${offer}.00`;

    const originalPriceEl = document.createElement("p");
    originalPriceEl.classList.add("original-price");
    originalPriceEl.textContent = `${original}.00`;

    const discountEl = document.createElement("p");
    discountEl.classList.add("discount-percentage");
    discountEl.textContent = discountPercentage;

    document.querySelector(".product-offer").append(offerPriceEl, discountEl);
    document.querySelector(".product__price-container").append(originalPriceEl);
};

// Display Product Options
const displayOptions = function (options) {
    options.forEach((option) => {
        const chooseHeading = document.createElement("span");
        chooseHeading.classList.add("span-text");
        chooseHeading.textContent = `Choose a ${option.name}`;

        if (option.name === "Color")
            document
                .querySelector(".product__color-container")
                .prepend(chooseHeading);
        else if (option.name === "Size")
            document.querySelector(".product__size-container").prepend(chooseHeading);
    });
};

// Display Product Color Blocks
const displayColorBlocks = function (options) {
    const { values: availableColors } = options.find(
        (option) => option.name === "Color"
    );

    availableColors.forEach((color) => {
        const colorName = Object.keys(color)[0];
        const colorValue = color[colorName];

        const colorButtons = document.createElement("button");
        colorButtons.classList.add("btn", "btn__color");
        colorButtons.setAttribute("data-color", colorName);
        colorButtons.setAttribute("data-color-value", colorValue);
        colorButtons.style.backgroundColor = colorValue;

        document.querySelector(".product-colors").append(colorButtons);
    });
};

// Display Product Size Options
const displaySizeOptions = function (options) {
    const { values: availableSizes } = options.find(
        (option) => option.name === "Size"
    );

    availableSizes.forEach((size) => {
        const radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.id = size.toLowerCase();
        radioInput.name = "size";

        const label = document.createElement("label");
        label.setAttribute("for", size.toLowerCase());
        label.textContent = size;

        const selectSizeContainer = document.createElement("div");
        selectSizeContainer.classList.add("select__size");

        selectSizeContainer.append(radioInput, label);
        document.querySelector(".product-sizes").append(selectSizeContainer);
    });
};

// Display Product Description
const displayProductDescription = function (description) {
    const productDescription = document.querySelector(
        ".product__description-container"
    );
    productDescription.innerHTML = description;
};

// Selecting Images
const mainImage = document.querySelector(".main-img img");
const thumbImagesContainer = document.querySelector(".thumb__images-container");
const thumbImages = document.querySelectorAll(".thumb__img");

thumbImagesContainer.addEventListener("click", function (e) {
    const clicked = e.target.closest(".thumb__img");

    if (!clicked) return;

    mainImage.src = clicked.src;
    thumbImages.forEach((thumb) => thumb.classList.remove("thumb__tab--active"));

    clicked.classList.add("thumb__tab--active");
});

// Selecting Colors
const colorContainer = document.querySelector(".product-colors");
const icons = document.querySelectorAll(".icon");
let clickedColor;

colorContainer.addEventListener("click", function (e) {
    if (clickedColor) {
        clickedColor.style.boxShadow = "";
    }

    clickedColor = e.target.closest(".btn__color");
    if (!clickedColor) return;

    colorContainer.querySelectorAll(".btn__color").forEach((color) => {
        color.classList.remove("btn__color-active");
    });
    clickedColor.classList.add("btn__color-active");

    const colorBorder = clickedColor.getAttribute("data-color-value");
    clickedColor.style.boxShadow = `0 0 0 6px #fff, 0 0 0 8px ${colorBorder}`;
});

// Get Product Data from API
fetch(
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448"
)
    .then((res) => res.json())
    .then(({ product }) => {
        // displayProductImages(product.images);
        displayProductName(product.vendor, product.title);
        displayProductPrice(product.price, product.compare_at_price);
        displayOptions(product.options);
        displayColorBlocks(product.options);
        displaySizeOptions(product.options);
        displayProductDescription(product.description);
    })
    .catch((err) => console.log(err.message));

// Selecting Quantity
const buttonDecrease = document.querySelector(".btn__dec");
const buttonIncrease = document.querySelector(".btn__inc");
const quantityInput = document.querySelector("#quantity");

buttonDecrease.addEventListener("click", function () {
    const currentValue = Number(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
});

buttonIncrease.addEventListener("click", function () {
    quantityInput.value = Number(quantityInput.value) + 1;
});

// Display message
const addToCartButton = document.querySelector(".btn__addToCart");
addToCartButton.addEventListener("click", function () {
    const productName = document.querySelector("h3").textContent;
    const selectedColor = clickedColor
        ? clickedColor.getAttribute("data-color")
        : null;

    const selectedRadioButton = document.querySelector(
        'input[name="size"]:checked'
    );
    const selectedSize = selectedRadioButton
        ? selectedRadioButton.nextElementSibling.textContent
        : null;

    const message = `${productName} with Color ${selectedColor} and Size ${selectedSize} added to cart`;

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("display-message");
    messageContainer.textContent = message;

    const previousMessageContainer = document.querySelector(
        ".product__size-container .display-message"
    );
    if (previousMessageContainer) {
        previousMessageContainer.remove();
    }

    if (selectedColor && selectedSize)
        document.querySelector(".product__size-container").append(messageContainer);
    else alert("Choose Color and Size");
});