# 💼 Smart Job Portal System

## 📌 Overview

Smart Job Portal is a full-stack web application that connects employers and job seekers. Employers can post and manage jobs, while job seekers can search, apply, and track their applications.

---

## 🚀 Features

### 👤 Authentication & Roles

* JWT-based authentication
* Role-based access (Employer / Job Seeker)

### 🧑‍💼 Employer Features

* Post new jobs
* View and manage job listings
* Review applications
* Accept / Reject candidates

### 👨‍💻 Job Seeker Features

* Browse and search jobs
* Apply for jobs
* Save jobs
* Track application status

### 🔔 Notifications

* Real-time notifications for application updates

---

## 🛠 Tech Stack

### Frontend

* React + TypeScript
* Redux Toolkit
* Tailwind CSS

### Backend

* Django
* Django REST Framework
* Django Channels (for notifications)

### Database

* PostgreSQL

### Authentication

* JWT (JSON Web Tokens)

---

## 🏗 Architecture

Frontend (React)
↓ API Calls (Axios)
Backend (Django REST API)
↓
PostgreSQL Database

---

## ⚙️ Installation

### Backend Setup

cd jobportal
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### Frontend Setup

cd frontend
npm install
npm run dev

---

## 📁 Project Structure

### Backend

* users/ → authentication & profiles
* jobs/ → job management
* applications/ → job applications
* notifications/ → real-time updates

### Frontend

* features/ → business logic (Redux)
* components/ → reusable UI
* layouts/ → dashboard layouts
* services/ → API integration

---

## 📡 API Endpoints (Sample)

### Authentication

POST /api/auth/login
POST /api/auth/register

### Jobs

GET /api/jobs/
POST /api/jobs/

### Applications

POST /api/applications/
GET /api/applications/my

---

## 📷 Screenshots

(Add screenshots here)

---

## 🔮 Future Improvements

* Pagination for job listings
* Better UI/UX design
* Deployment (AWS / Vercel / Render)
* Advanced filtering

---

## 👤 Author

Fathima Nasreen
