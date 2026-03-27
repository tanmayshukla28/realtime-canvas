# 🚀 Realtime Collaborative Canvas

A realtime collaborative whiteboard application that allows multiple users to draw and interact on a shared canvas without authentication.

---

## 🌐 Features

* ✏️ Freehand drawing (Pen Tool)
* ⬛ Rectangle Tool
* ⚪ Ellipse Tool
* 👥 Realtime collaboration using WebSockets
* 🔗 Shareable room-based URLs
* 🔄 Per-user Undo/Redo functionality
* 🎨 Color picker & stroke width customization
* 👆 Live cursor tracking (multi-user)
* ♾️ Infinite canvas with pan & zoom support
* 🧩 Smooth and intuitive UI

---

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML5 Canvas API
* Socket.io Client

### Backend

* Node.js
* Express.js
* Socket.io

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/tanmayshukla28/realtime-canvas.git
cd realtime-canvas
```

---

### 2️⃣ Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

### 3️⃣ Run the application

#### Start backend

```bash
cd backend
node server.js
```

#### Start frontend

```bash
cd frontend
npm start
```

---

### 4️⃣ Open in browser

```
http://localhost:3000/room1
```

👉 Open the same URL in multiple tabs to test realtime collaboration.

---

## 🧠 Key Concepts Implemented

* WebSocket-based realtime synchronization
* Room-based architecture
* Per-user state isolation (Undo/Redo)
* Canvas transformations for infinite space (Pan & Zoom)
* Efficient rendering using redraw strategy

---

## ⚠️ Limitations

* Data is stored in-memory (no database persistence)
* Basic shape support (can be extended further)

---

## 📌 Future Improvements

* Database persistence (MongoDB / Redis)
* Shape selection & resizing
* Text tool
* Layer management
* Authentication system

---

## 🤖 AI Prompts Used

* "How to implement realtime drawing sync using Socket.io in a collaborative canvas app?"
* "How to design per-user undo and redo functionality in a shared canvas environment without affecting other users?"
* "How to implement infinite canvas with pan and zoom using HTML5 Canvas transformations?"
* "How to track and display live cursors of multiple users in a realtime collaborative application?"

---

## 👨‍💻 Author

**Tanmay Shukla**
