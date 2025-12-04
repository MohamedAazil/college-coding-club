# 🚀 College Coding Club

A collaborative coding platform for college students featuring **Supabase authentication**, **community blogs**, **competitive coding stats**, **real-time features**, and an **online code editor**.

---

## 📖 Overview

**College Coding Club** is a full-stack web application built for college students to learn, collaborate, and grow together.

This app integrates:

* **Django backend**
* **React frontend**
* **Supabase authentication + database**
* **LeetCode API for coding stats**
* **WebSocket-based real-time notifications**
* **Collaborative blog & discussions**
* **Integrated code editor with test case execution**

---

## ⭐ Features

### 🔐 Authentication (Supabase)

* Email + Password login/signup
* Email verification
* Secure session management
* Token-based authentication for Django API

### 🧑‍💻 Code Editor

* Syntax-highlighting editor
* Run code with predefined test cases
* Supports multiple languages (Python/JS)

### 📝 Blog & Community

* Create posts
* Comment on posts
* Likes + threaded replies
* College-focused discussion channels

### ⚡ Real-Time Features

* WebSocket notifications
* Live updates for community interactions

### 📊 Coding Stats

* LeetCode integration to fetch user stats automatically

---

## 🛠 Tech Stack

### **Frontend**

* React (Vite)
* Tailwind CSS
* Axios

### **Backend**

* Django
* Django REST Framework
* Supabase Python Client
* WebSockets (Django Channels)

### **Database & Auth**

* Supabase (PostgreSQL + Auth)

---


## 🐍 Backend Setup (Django)

### 1️⃣ Create and activate virtual environment

```bash
python -m venv venv
source venv/bin/activate  # Linux & Mac
venv\Scripts\activate     # Windows
```

### 2️⃣ Install backend dependencies

```bash
pip install -r requirements.txt
```

---


## 🔄 Run Backend

```bash
python manage.py migrate
python manage.py runserver
```

Backend: [http://localhost:8000](http://localhost:8000)

---

## 🎨 Frontend Setup (React + Vite)

### Install dependencies:

```bash
cd frontend
npm install
```

### Run the frontend:

```bash
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)

---

## ▶️ Running the Full App

Start backend:

```bash
venv\Scripts\activate
cd backend
python manage.py runserver
```

Start frontend:

```bash
cd frontend
npm run dev
```

Your app is live 🎉

---

## 🌿 Branching Guidelines

Use the following flow:

| Task        | Branch Format           |
| ----------- | ----------------------- |
| New feature | `ticket-number`         |
| Commit      | `[ticket-number]: `     |
|             | `[Work Type] - Message` |
| Hotfix      | `hotfix/<issue>`        |
| Release     | `release/v1.0.0`        |

Example:

```
git checkout -b feature/auth-system
```

---

## 🤝 Contributing

1. Fork repo
2. Create new branch:

   ```
   git checkout -b feature/cool-feature
   ```
3. Commit changes:

   ```
   git commit -m "[Ticket Number] [UI or BE or DB or OPS]: Commit Message"
   ```
4. Push to GitHub:

   ```
   git push origin ticket-number
   ```
5. Create Pull Request

---

## 🐛 Troubleshooting

### ❌ Supabase Auth not working?

* Ensure `.env` is correct
* Check CORS in Supabase Dashboard
* Ensure email verification is enabled

### ❌ "No module named websockets.asyncio"

Upgrade websockets:

```bash
pip install websockets==12.0
```

### ❌ CORS error on frontend

Add in Django settings:

```python
CORS_ALLOW_ALL_ORIGINS = True
```

---
