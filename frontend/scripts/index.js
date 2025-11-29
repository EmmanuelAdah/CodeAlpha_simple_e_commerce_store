const products = [
        { id: 1, title: "Wireless Headphones", price: "$59.99", image: "https://img-1.kwcdn.com/product/fancy/3b4de749-13a6-4c1a-8924-ad8966c68989.jpg?imageView2/2/w/800/q/70/format/avif", description: "High-quality wireless headphones with noise cancellation.", rating: 4.5, colors: ["Black", "White", "Red", "Blue", "Yellow"] },
        { id: 2, title: "Smart Watch", price: "$129.99", image: "https://img.kwcdn.com/product/fancy/e78e8dfd-610c-4759-a9c1-870e23f47395.jpg?imageView2/2/w/800/q/70/format/avif", description: "Smart watch with heart rate monitor and GPS.", rating: 4.2, colors: ["Black", "White", "Red", "Blue", "Yellow"] },
        { id: 3, title: "Grey T-Shirt", price: "$34.99", image: "https://img.kwcdn.com/product/fancy/c7139053-45da-4413-8675-387f5dfdde15.jpg?imageView2/2/w/800/q/70/format/avif", description: "A light grey t-shirt with a touch of black art works with beauty.", rating: 4.6, sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
        { id: 4, title: "Gaming Mouse", price: "$39.99", image: "https://img.kwcdn.com/product/fancy/5b9a16b2-99fe-417e-b09f-cb4b0eb4393e.jpg?imageView2/2/w/800/q/70/format/avif", description: "Ergonomic gaming mouse with adjustable DPI.", rating: 4.7, colors: ["Black", "White", "Red", "Blue"] },
        { id: 5, title: "Bluetooth Speaker", price: "$49.99", image: "https://img.kwcdn.com/product/fancy/939b4365-fab3-41a9-88f6-a67e642daf39.jpg?imageView2/2/w/800/q/70/format/avif", description: "Portable Bluetooth speaker with waterproof design.", rating: 4.3, colors: ["Black", "White", "Red", "Blue", "Yellow"] },
        { id: 6, title: "White T-Shirt", price: "$40.99", image: "https://img.kwcdn.com/product/fancy/6a9a4ef7-9218-4cb3-8dc1-efdf48f2ab2e.jpg?imageView2/2/w/800/q/70/format/avif", description: "A light t-shirt with a touch of black art works with beauty.", rating: 4.5, sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
        { id: 7, title: "White Gaming Mouse", price: "$40.99", image: "https://img.kwcdn.com/product/fancy/f0b54bbd-a7d6-4670-a742-a7cbab00935f.jpg?imageView2/2/w/800/q/70/format/avif", description: "White ergonomic gaming mouse with adjustable DPI.", rating: 4.7, colors: ["Black", "White", "Red"] },
        { id: 8, title: "African Tribal Print Shirt", price: "$41.99", image: "https://img.kwcdn.com/product/open/91f4cf4011ec4ab095fee089363e6881-goods.jpeg?imageView2/2/w/800/q/70/format/avif", description: "Men's African Tribal Print Shirt - Lightweight Breathable", rating: 4.8, sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
        { id: 9, title: "Men'S Vintage Egyptian", price: "$41.99", image: "https://img.kwcdn.com/product/fancy/3d1f2cc2-4c63-4ea6-9755-0048eeae74e7.jpg?imageView2/2/w/800/q/70/format/avif", description: "Men'S Vintage Egyptian-Inspired Geometric Art Print Short", rating: 4.8, sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
    ];

    document.DOMContentLoaded = () => {}
    let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

    // let productsFromDB = await fetch('http://localhost:8000/products/products')

    const container = document.getElementById("productsContainer");
    products.forEach(product => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="product-title">${product.title}</div>
            <div class="product-price">${product.price}</div>
            <div class="product-rating">ratings: ⭐${product.rating}</div>
            <button class="btn add-to-cart-btn" onclick="addToCart(${product.id}, this)">🛒 Add to Cart</button>
            <button class="btn view-btn" onclick="viewDetails(${product.id})">View Details</button>
        `;
        container.appendChild(div);
    });

    // Add product to Cart
    function addToCart(id, btn ) {
        const product = products.find(product => product.id === id);
        const existing = cart.find(item => item.id === id);

        if (existing)
            existing.quantity++;
        else
            cart.push({...product, quantity: 1});

        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("quantity", localStorage.getItem('quantity') + 1);
        updateCartCount();

        // For cart and add-to-cart button animation upon adding an item
        const cartIcon = document.getElementById("cartIcon");
        cartIcon.style.transform = "scale(1.3)";
        setTimeout(() => cartIcon.style.transform = "scale(1)", 200);

        if (btn) {
            btn.textContent = "✔ Added!";
            setTimeout(() => btn.textContent = "🛒 Add to Cart", 1000);
        }
    }

    // For updating cart count
    function updateCartCount() {
        const countEl = document.getElementById("cartCount");
        let total;
        total = cart.reduce((sum, item) => sum + item.quantity, 0);
        localStorage.setItem('quantity', total);
        countEl.textContent = localStorage.getItem('quantity');
        renderCart();
    }

    // For viewing product details
    function viewDetails(id) {
        const product = products.find(p => p.id === id);
        const sizeOptions = handleSelectSize(product);
        const colorOptions = buildColorOptions(product);

        // Set popup content
        document.getElementById("popupDetails").innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price"><strong>Price:</strong> ${product.price}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Rating:</strong> ⭐ ${product.rating}</p>
            ${sizeOptions}
            ${colorOptions}
        `;
            const selectedColor = handleColorChange(product);

        const popupAddBtn = document.getElementById("popupAddBtn");
        popupAddBtn.onclick = () => {
            const selectedSize = product.sizes ? document.getElementById('sizeSelect').value : null;
            addToCart(product.id, selectedSize, selectedColor);
        };
        document.getElementById("popupOverlay").style.display = "flex";
    }

    // Build clickable color options if available
    function buildColorOptions(product) {
        let colorOptions = '';
        if (product.colors && product.colors.length > 0) {
            colorOptions = `
                <div><strong>Color:</strong></div>
                <div id="colorOptions" style="display:flex; gap:8px; margin-top:5px;">
                    ${product.colors.map(color => `
                        <div 
                            class="color-swatch" 
                            data-color="${color}" 
                            style="width:24px; height:24px; background-color:${color.toLowerCase()}; border:2px solid #ccc; cursor:pointer; border-radius:50%;">
                        </div>
                    `).join('')}
                </div>
            `;
        }
        return colorOptions;
    }

    // Build size options if available
    function handleSelectSize(product) {
        let sizeOptions = '';
        if (product.sizes && product.sizes.length > 0) {
            sizeOptions = `
                <label for="sizeSelect"><strong>Size:</strong></label>
                <select id="sizeSelect">
                    ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                </select>
            `;
        }
        return sizeOptions;
    }

    function handleColorChange(product) {
            let selectedColor = null;
        if (product.colors && product.colors.length > 0) {
            const colorSwatches = document.querySelectorAll("#colorOptions .color-swatch");
            colorSwatches.forEach(swatch => {
                swatch.addEventListener("click", () => {
                    colorSwatches.forEach(color => color.style.border = "2px solid black");
                    swatch.style.border = "3px solid white";
                    selectedColor = swatch.dataset.color;
                });
            });
        }
        return selectedColor;
    }


    // For closing the view details pop-up
    function closePopup() {
        document.getElementById("popupOverlay").style.display = "none";
    }

    // For manipulating the cart icon
    const cartIcon = document.getElementById("cartIcon");
    cartIcon.addEventListener("click", () => {
        renderCart();
        const orderButton = document.querySelector(".order-btn");
        const savedCart = localStorage.getItem("cart");
        document.getElementById("cartOverlay").style.display = "flex";
        orderButton.disabled = savedCart.length === 0;
    });

    //  For rendering cart items
    function renderCart() {
        const cartItems = document.getElementById("cartItems");
        if(cart.length === 0) cartItems.innerHTML = "<p>Your cart is empty.</p>";
        else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${item.price} x ${item.quantity}</div>
                    </div>
                </div>
            `).join("");
        }
    }

    // For closing or exiting the cart interface
    function closeCart() {
        document.getElementById("cartOverlay").style.display = "none";
    }

    // For clearing an existing cart list
    function clearCart() {
        if(confirm("Are you sure you want to clear your cart?")) {
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            setTimeout(()=>alert("Your cart has been cleared successfully!"), 1000);
        }
    }

    // for placing order
    function placeOrder() {
        if(cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert("Order placed successfully!");
        cart = [];
        updateCartCount();
        closeCart();
    }

    const toggle = document.getElementById("modeToggle");

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        toggle.textContent = "🌙";
    } else {
        toggle.textContent = "☀️";
    }
    toggle.onclick = () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        toggle.textContent = isDark ? "🌙" : "☀️";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    };