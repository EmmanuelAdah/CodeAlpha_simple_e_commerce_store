
# 🛒 Simple E-Commerce Store

*A minimal full-stack e-commerce application built with Node.js (backend) and vanilla HTML, CSS, and JavaScript (frontend).*

---

## 🚀 Overview

This project is a **simple e-commerce store** where users can:

* Browse products
* View product details
* Add items to a shopping cart
* Adjust cart quantity
* Remove items from cart
* Place an order
* View order confirmation

The frontend uses **HTML/CSS/JavaScript**, while the backend is powered by **Node.js, Express, and MongoDB**.

---

## 🛠️ Tech Stack

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication (optional)
* Cloudinary (optional for product images)

### **Frontend**

* HTML5
* CSS3
* Vanilla JavaScript (Fetch API)

---

## 📁 Project Structure

```
/backend
 ├── controllers
 ├── models
 ├── routes
 ├── middlewares
 ├── server.js
/frontend
 ├── pages
 ├── styles
 ├── scripts
 ├── images
 └── index.html
```

---

## 🎯 Features

### ✔ Product Features

* View all products
* View detailed product page
* Product images (local or Cloudinary)
* Product categories (optional)

### ✔ Cart Features

* Add item to cart
* Increase / decrease quantity
* Remove items
* Cart saved in localStorage (frontend)
* Automatic total calculation

### ✔ Order Features

* Create an order from cart items
* Validate items and totals on backend
* Order saved in MongoDB
* Order summary returned to frontend

### ✔ General

* Clean responsive UI
* Fully functional backend API
* Lightweight (no frontend frameworks)
* Easy to extend

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2️⃣ Install backend dependencies

```sh
cd backend
npm install
```

### 3️⃣ Create an environment file

Inside `backend/.env` add:

```
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret  (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name  (optional)
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 4️⃣ Start the backend server

```sh
npm start
```

The API will run on:

```
http://localhost:5000
```

### 5️⃣ Open the frontend

Open `frontend/index.html` in your browser.

---

## 🧪 REST API Endpoints

### **Products**

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/products`           | Get all products      |
| GET    | `/products/:id`       | Get a single product  |
| POST   | `/add/products`       | Add a product (admin) |
| PUT    | `/update/product/:id` | Update a product      |
| DELETE | `/delete/product/:id` | Delete a product      |

### **Orders**

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| POST   | `/create/order`         | Create an order from cart items |
| GET    | `/orders/:userId`       | Get user orders                 |

---

## 🛍️ Cart Logic (Frontend)

The cart is stored in **localStorage**:

```js
localStorage.setItem("cart", JSON.stringify(cartItems));
```

And updated via JavaScript when users add/remove items.

The frontend sends the cart items to the backend during order creation.

---

## 📸 Screenshots (Optional)



---

## 🤝 Contributing

Feel free to fork and submit a pull request.
Contributions are welcome!

---
