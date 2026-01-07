# Google Drive Files Explorer with AI Analytics

This project is a **full‑stack application** that integrates:

* **Google Drive API** – fetch and manage files
* **Node.js + TypeScript** – backend API
* **Vue 3 + Vite** – frontend UI
* **OpenAI API** – natural‑language analytics over files

Users can view Google Drive files, perform CRUD operations by file ID, and ask AI questions like:

* Who owns the most files?
* Which file was modified most recently?
* What is the average number of files per owner?
* Which file is the largest?
* What is the distribution of files by modified date?

---

## 🔐 Prerequisites

* Node.js **20.19+** or **22.12+**
* Google Cloud project with **Drive API enabled**
* Service Account credentials JSON
* GoogleAI account with **active billing**

---

## ⚙️ Backend Setup (Node.js + TypeScript)

### 1️⃣ Install dependencies

```bash
cd backend
npm install
```

### 2️⃣ Environment variables

Create `backend/.env`

```env
PORT=3000
GEMINI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```
---

### 3️⃣ Google Drive Service Account

* Create a **Service Account** in Google Cloud
* Enable **Google Drive API**
* Download JSON key
* Share Drive files/folders with `client_email`

---

### 4️⃣ Run backend

```bash
npm run dev
```

Backend runs on:

```
http://localhost:3000
```

---

## 🌐 Frontend Setup (Vue 3 + Vite)

### 1️⃣ Install dependencies

```bash
cd frontend
npm install
```

### 2️⃣ Run dev server

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔄 API Endpoints

### 📁 Files

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | `/files`                    | Fetch all files        |
| GET    | `/files?modifiedAfter=DATE` | Fetch by modified date |
| GET    | `/files/:id`                | Get file by ID         |
| PATCH  | `/files/:id`                | Update file metadata   |
| DELETE | `/files/:id`                | Delete file            |

---

### 🤖 AI

**POST** `/ask-ai`

```json
{
  "question": "Who owns the most files?",
  "files": []
}
```

Response:

```json
{
  "answer": "User X owns the most files"
}
```

---

## 🧠 AI Logic

* Files metadata is passed from frontend
* Backend sends structured prompt to OpenAI
* Model used: `gemini-2.5-flash`
* Backend handles rate limits and errors

---

## 🎨 UI Features

* Files displayed in table
* Ask‑AI component rendered **below the table**
* Natural language questions
* Real‑time responses

---

## 🔒 Security

* API keys stored in `.env`
* GoogleAI key never exposed to frontend
* CORS enabled for local development

---

### Empty Drive files

* Verify files are shared with service account email

### CORS errors

* Ensure backend uses `cors()` middleware


