\# 🛒 MERN E-Commerce Platform with AI \& Multi-Role System



A full-stack e-commerce application built using the MERN stack featuring \*\*User, Seller, and Admin roles\*\*, with AI-powered search, real-time stock management, secure authentication, and payment integration.



---



\## 🚀 Key Highlights



\* 🔍 AI-powered \*\*semantic product search\*\* using embeddings

\* 🤝 \*\*Frequently Bought Together\*\* recommendations

\* 📦 Real-time \*\*stock management system\*\* (auto update on order \& cancellation)

\* 🛒 \*\*Cart validation system\*\* to prevent over-ordering

\* 🔐 Secure authentication with \*\*OTP verification + Google OAuth + JWT\*\*

\* 💳 Integrated \*\*Stripe payment gateway\*\*

\* 🎯 Role-based access: \*\*User / Seller / Admin\*\*

\* 📊 Seller dashboard with \*\*sales analytics \& order insights\*\*



---



\## 🧑‍💻 Features by Role



\### 🛍️ User



\* Register/Login with OTP \& Google authentication

\* Browse products with intelligent search

\* Add to cart with stock validation

\* Wishlist functionality

\* Place orders (COD \& Stripe payment)

\* Track and request order cancellation



---



\### 🧑‍💼 Seller



\* Add, edit, and manage products

\* Real-time stock updates

\* Manage incoming orders

\* Approve or reject cancellations

\* View \*\*seller dashboard with revenue, orders, and performance metrics\*\*



---



\### 🛠️ Admin



\* Approve or reject seller registrations

\* Block or manage users

\* Remove or moderate products

\* Monitor platform activity and enforce system rules



---



\## 🤖 AI Features



\* Semantic search using vector embeddings

\* Cosine similarity-based product matching

\* Frequently bought together recommendation system



---



\## ⚙️ Core System Design



\* Backend validation to prevent invalid orders

\* Stock decrement on order placement

\* Stock restoration on cancellation

\* Cart-level validation with user feedback

\* Secure API routes with authentication \& authorization



---



\## 🛠️ Tech Stack



\### Frontend



\* React.js

\* Axios

\* React Router

\* Framer Motion (UI animations)



\### Backend



\* Node.js

\* Express.js

\* MongoDB (Mongoose)



\### Integrations



\* Stripe (Payments)

\* Google OAuth

\* OTP-based authentication



---



\## 📁 Project Structure



```id="zj4j7z"

root/

├── backend/

├── frontend/

```



---



\## ⚙️ Setup Instructions



\### Clone Repository



```id="v3u0cg"

git clone https://github.com/YOUR\_USERNAME/YOUR\_REPO.git

cd YOUR\_REPO

```



---



\### Backend Setup



```id="6dnd3k"

cd backend

npm install

npm start

```



Create `.env` file:



```id="m2i5bx"

MONGO\_URI=your\_mongodb\_url

JWT\_SECRET=your\_secret

STRIPE\_SECRET\_KEY=your\_key

GOOGLE\_CLIENT\_ID=your\_client\_id

```



---



\### Frontend Setup



```id="7o7jhs"

cd frontend

npm install

npm run dev

```



Create `.env` file:



```id="lfz6l9"

VITE\_API\_URL=http://localhost:5000

```



---



\## 🌐 Deployment



\* Frontend: Vercel

\* Backend: Render



---



\## 👨‍💻 Author



Adarsh C



