![ThreeJS Layout Tool](https://jpcdn.it/img/small/a82871654056ebd8ee896587b37b2cc0.png)

# ThreeJS Layout Tool

## 🧠 Description

**ThreeJS Layout Tool** is a web-based 3D scene editor built for creating, arranging, and visualizing layouts directly in the browser. It is designed to provide an interactive HUD-like interface where users can place, manipulate, and preview 3D models in real time.

The tool is especially useful for:
- Rapid 3D scene prototyping  
- Layout design and visualization  
- Interactive simulations  
- Game/environment planning  

---

## ⚙️ Tech Stack

This project is built using modern web technologies:

- **Next.js** – React framework for production-ready apps  
- **TypeScript** – Strongly typed JavaScript  
- **Tailwind CSS** – Utility-first styling  
- **Three.js** – 3D rendering engine  
- **@react-three/fiber** – React renderer for Three.js  
- **@react-three/drei** – Useful helpers for R3F  

---

## 📦 Dependencies

Main dependencies used in this project:

- `next`
- `react`
- `react-dom`
- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `tailwindcss`
- `typescript`

> You can find the full list in `package.json`.

---

## 🚀 Getting Started

Follow these steps to run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/Dulaj007/3d-sim.git
```
### 2. Navigate into the project

```bash
cd 3d-sim
```

### 3. Install dependencies
   
```bash
npm install
```
### 4. Run the development server

```bash
npm run dev
```
### 5. Open in browser

```bash
http://localhost:3000
```

## ✨ Features

### 🧱 Core 3D Editing

- Upload and place **multiple 3D models** into the scene  
- Freely **move, rotate, and scale** each model  
- Real-time updates for precise layout control  
- Designed for intuitive drag-and-adjust workflows  

---

### 🌍 Environment Controls

- Switch between different **environment presets** (e.g. forest, studio, HDRI lighting)  
- Support for **custom environment maps**  
- **Camera controls**:
  - Orbit, zoom, and pan freely  
  - Option to **lock camera position** for consistent viewing  

---

### 🎬 Animation System (Save Points)

- Create animations using a **save point system**  
- Store multiple states of a model including:
  - Position  
  - Rotation  
  - Scale  
- Each save point acts like a **keyframe**  
- Enables smooth transitions and scene-based animations  

---

### 💾 Saving System

- Export the entire scene as a **single JSON file**  
- Includes:
  - All models and their transforms  
  - All animation save points  
  - Camera position and settings  
- Allows full scene reconstruction at any time  

---

### 🧩 Inspector Panel

- Displays details of the **selected object**  
- Shows real-time values for:
  - Position  
  - Rotation  
  - Scale  
- Also includes **world camera data** for reference and debugging  

---

### 📂 Object Panel

- Lists all **imported models** in the scene  
- Displays all **saved animation points**  
- Enables quick selection and navigation between objects  
- Helps manage complex scenes efficiently  

---

## 🧪 Test Case – Scene Export & Reconstruction Accuracy ([#20](../../issues/20))

![Editor View](https://jpcdn.it/img/small/a82871654056ebd8ee896587b37b2cc0.png)

### 📌 Objective

To verify that the **exported JSON data** (including model transforms and camera data) accurately reproduces the same scene when reloaded.

---

### 🧱 Test Scenario

In this test, we used the editor to:

- Add **two butterfly models**
- Add a **tree stick model**
- Adjust their:
  - Position  
  - Rotation  
  - Scale  
- Set a specific **camera view**
- Save all coordinates and configurations  

The above image represents the **editor view**, where the scene was manually arranged.

---

### 💾 Step 1 – Export Scene

- Export the scene as a **JSON file**
- This file contains:
  - Model data (position, rotation, scale)
  - Camera position and rotation
  - All relevant scene configuration  

---

### 🔁 Step 2 – Recreate Scene from JSON

Using the exported JSON data:

- A new test scene was created
- The same models were loaded:
  - Two butterflies  
  - One tree stick  
- Applied:
  - Exact transform values (position, rotation, scale)  
  - Same camera data  

---

### 🔍 Step 3 – Validation

The recreated scene was visually compared with the original editor scene.

![Reconstructed Scene](https://jpcdn.it/img/small/ac5c190c2f3ac052cd8a6dcdd69fee22.png)

---

### ✅ Result

- The reconstructed scene **perfectly matches** the original editor view  
- Model placements, orientations, and scale are identical  
- Camera perspective is also consistent  

---

### 🎯 Conclusion

This test confirms that:

- The **export system is accurate and reliable**  
- Scene data can be safely stored and reused  
- The tool supports **full scene reconstruction from JSON** without loss of fidelity  

---
