# 🌾 Gram Panchayat Balua - Digital Voting System

## 📌 Project Overview

Gram Panchayat Balua ek **digital village management system** hai jisme users apna profile manage kar sakte hain aur future me online voting system implement kiya ja raha hai.

Is project ka main goal hai:

* Village level digitalization
* Transparent voting system
* User profile management

---

## 🚀 Features (Completed)

### 👤 User Management

* User profile update
* Avatar upload (Cloudinary integration)
* Profile details (bio, gender, DOB, skills, social links)

### 🖼️ Avatar Upload

* Image validation (file type + size limit)
* Cloudinary upload
* Auto URL storage

### 🧾 Address Management

* Address update API
* Village validation (allowed villages only)
* District validation (Uttar Pradesh only)
* State validation (India states list)
* Pincode validation (6 digit)

### 📊 User APIs

* Get all users (excluding super-admin)
* Get user by ID
* Get user address
* Get user profile

### 🔐 Security & Control

* Rate limiting on APIs
* Role-based access (Admin / Super Admin)
* User activation / deactivation toggle

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Cloudinary (Image Upload)
* JWT Authentication

---

## 📂 API Endpoints

### 👥 User Routes

```
GET    /get-all-users
GET    /get-user/:userId
GET    /get-user-address/:userId
GET    /get-user-profile/:userId
POST   /toggle-user-activation
```

---

## 📦 Folder Structure (Simplified)

```
controllers/
models/
routes/
middlewares/
utils/
```

---

## ⚙️ Validations Implemented

* ObjectId validation
* File validation (image upload)
* State & district validation
* Pincode validation
* Required field checks

---

## 🔄 Upcoming Features (In Progress)

### 🗳️ Voting System

* Election creation
* Candidate management
* One user = one vote
* Vote counting system
* Result declaration

---

## 🎯 Future Scope

* Real-time voting results
* District-wise elections
* Admin dashboard UI
* Fraud prevention system

---

## 👨‍💻 Author

Ritesh Mishra
Full Stack Developer (MERN)

---

## 📌 Note

This project is under active development and new features are being added continuously.
