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

### 📅 Event Creation

* Create new events (Election, Party, Meeting, Function, Festival)
* Update existing events
* Delete events (Admin only)
* Fetch all events
* Get event by slug

---

### 🔐 Secure Voting Management

* OTP-based voting system
* One vote per user per event
* Secure voter identity using SHA-256 hashing
* Duplicate vote prevention
* Candidate-event validation (no cross-event voting)
* Vote casting via API
* Result fetching after event completion

#### ⚡ Advanced Features

* Rate limiting to prevent spam voting
* OTP expiration & automatic cleanup
* Input sanitization & validation
* Secure backend with protected routes
* Event-based voting system (each event has separate voting)
* Voting allowed only during event duration
* Auto blocking of invalid or repeated requests
* Scalable voting logic for multiple events
* Designed to simulate a real-world election system with security, scalability, and fairness.

---

### 🧑‍🤝‍🧑 Candidate (CRUD Operation)

* Candidate create
* Candidate update
* Candidate delete
* Candidates fetch
* Candidate fetch by ID

---

### 🗳️ Voting Routes

```
POST   /vote/:candidateId
GET    /election/:eventId/result
```

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Cloudinary (Image Upload)
* JWT Authentication
* Bcrypt (OTP hashing)
* Crypto (secure voter hashing)

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


### 🗳️ Advanced Voting Features

* Live vote counting
* Real-time leaderboard
* Tie-case handling
* Frontend voting UI

---

## 👨‍💻 Author

Ritesh Mishra
Full Stack Developer (MERN)

---

## 📌 Note

This project is under active development and new features are being added continuously.
