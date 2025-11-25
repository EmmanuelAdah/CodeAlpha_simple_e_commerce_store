const products = [
        { id: 1, title: "Wireless Headphones", price: "$59.99", image: "https://img-1.kwcdn.com/product/fancy/3b4de749-13a6-4c1a-8924-ad8966c68989.jpg?imageView2/2/w/800/q/70/format/avif", description: "High-quality wireless headphones with noise cancellation.", rating: 4.5 },
        { id: 2, title: "Smart Watch", price: "$129.99", image: "https://img.kwcdn.com/product/fancy/e78e8dfd-610c-4759-a9c1-870e23f47395.jpg?imageView2/2/w/800/q/70/format/avif", description: "Smart watch with heart rate monitor and GPS.", rating: 4.2 },
        { id: 3, title: "Grey T-Shirt", price: "$34.99", image: "https://img.kwcdn.com/product/fancy/c7139053-45da-4413-8675-387f5dfdde15.jpg?imageView2/2/w/800/q/70/format/avif", description: "A light grey t-shirt with a touch of black art works with beauty.", rating: 4.6 },
        { id: 4, title: "Gaming Mouse", price: "$39.99", image: "https://img.kwcdn.com/product/fancy/5b9a16b2-99fe-417e-b09f-cb4b0eb4393e.jpg?imageView2/2/w/800/q/70/format/avif", description: "Ergonomic gaming mouse with adjustable DPI.", rating: 4.7 },
        { id: 5, title: "Bluetooth Speaker", price: "$49.99", image: "https://img.kwcdn.com/product/fancy/939b4365-fab3-41a9-88f6-a67e642daf39.jpg?imageView2/2/w/800/q/70/format/avif", description: "Portable Bluetooth speaker with waterproof design.", rating: 4.3 }
    ];

    let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

    const container = document.getElementById("productsContainer");

    // Render products
    products.forEach(product => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="product-title">${product.title}</div>
            <div class="product-price">${product.price}</div>
            <button class="btn add-to-cart-btn" onclick="addToCart(${product.id}, this)">🛒 Add to Cart</button>
            <button class="btn view-btn" onclick="viewDetails(${product.id})">👁️ View Details</button>
        `;
        container.appendChild(div);
    });


    // Add to Cart
    function addToCart(id, btn = null) {
        const product = products.find(p => p.id === id);
        const existing = cart.find(item => item.id === id);
        if (existing) existing.quantity++;
        else cart.push({...product, quantity: 1});
        localStorage.setItem("cart", JSON.stringify(cart));
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
        countEl.textContent = total;
        renderCart();
    }


    // View product details
    function viewDetails(id) {
        const product = products.find(p => p.id === id);
        document.getElementById("popupDetails").innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price" value={product.price}><strong>Price:</strong> ${product.price}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Rating:</strong> ⭐ ${product.rating}</p>
        `;
        const popupAddBtn = document.getElementById("popupAddBtn");
        popupAddBtn.onclick = () => addToCart(product.id);
        document.getElementById("popupOverlay").style.display = "flex";
    }


    // For closing the view details pop-up
    function closePopup() {
        document.getElementById("popupOverlay").style.display = "none";
    }

    // For manipulating the cart icon
    const cartIcon = document.getElementById("cartIcon");
    cartIcon.addEventListener("click", () => {
        renderCart();
        document.getElementById("cartOverlay").style.display = "flex";
    });

    //  For redering cart items
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