# 🏠 VastuVision AI

> **AI-Powered Indian Interior Design & Vastu Planning Assistant**  
> A full-stack MERN college project integrating traditional Vastu Shastra principles with modern AI-generated room visualization.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [AI Pipeline](#ai-pipeline)
- [Mock / Demo Mode](#mock--demo-mode)
- [Example Request](#example-request)
- [Future Improvements](#future-improvements)

---

## 🎯 Project Overview

VastuVision AI is a full-stack web application that generates AI-powered interior design concepts for residential spaces in Mumbai and Navi Mumbai, India.

The system accepts user inputs (location, room size, requirements, photos), runs them through an AI reasoning pipeline that applies traditional **Vastu Shastra** principles alongside modern **architectural design** best practices, and generates a **6-view composite room visualization** image.

> **Academic Disclaimer:** Vastu Shastra recommendations are presented as traditional cultural beliefs — not as scientifically proven facts. Every recommendation is clearly labeled as either a "Traditional Vastu Recommendation" or a "Practical Design Recommendation."

---

## ✨ Features

| Feature | Description |
|---|---|
| 🕉️ Vastu Analysis | Traditional Vastu Shastra directional analysis, clearly labeled |
| 🎨 6-View Visualization | AI-generated composite image with 6 architectural views |
| 📸 Photo Upload | Upload existing room photos for contextual analysis |
| 💬 Chat Refinement | GPT-style chat to refine designs after generation |
| 🗂️ Design History | Persistent design history with MongoDB |
| ⚡ Demo Mode | Full demo without any AI API keys (mock mode) |
| 🔌 Modular AI | Swap between OpenAI, Gemini, Anthropic easily |
| 📱 Responsive UI | Dark-themed, glassmorphism, modern responsive design |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **Tailwind CSS v3**
- **React Router v7**
- **Axios**

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Multer** (file uploads)
- **Helmet**, **CORS**, **express-rate-limit** (security)

### AI (Modular — swap via env vars)
- **Text AI:** Google Gemini / OpenAI GPT / Anthropic Claude
- **Image AI:** OpenAI DALL-E 3 / Stability AI / Gemini Imagen

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)               │
│  Home → NewDesign → DesignResultPage → History          │
│  Sidebar | Header | DesignForm | ChatInput | ChatMessage│
└────────────────────┬────────────────────────────────────┘
                     │ HTTP (Axios)
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (Node + Express)                 │
│                                                         │
│  /api/ai/design ──────────────────────────────────────┐ │
│  /api/designs/:id/refine                              │ │
│  /api/designs (CRUD)                                  │ │
│                                                       │ │
│  ┌──────────────── AI Pipeline ───────────────────┐  │ │
│  │ 1. Validate Input                              │  │ │
│  │ 2. Normalize Location (location.service.js)    │  │ │
│  │ 3. Process Uploads (upload.service.js)         │  │ │
│  │ 4. Build Design Prompt (prompt.service.js)     │  │ │
│  │ 5. Text AI Analysis (textAI.service.js)        │  │ │
│  │    → Gemini | OpenAI | Anthropic | Mock        │  │ │
│  │ 6. Parse & Validate JSON Response              │  │ │
│  │ 7. Build Image Prompt (imagePrompt.service.js) │  │ │
│  │ 8. Image AI Generation (imageAI.service.js)    │  │ │
│  │    → DALL-E | Stability | Mock                 │  │ │
│  │ 9. Save to MongoDB (design.service.js)         │  │ │
│  └────────────────────────────────────────────────┘  │ │
│                                                       │ │
└───────────────────────────────────────────────────────┘─┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              MongoDB (Mongoose)                          │
│  Collections: users | designs | designversions          │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
VastuVision-AI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── env.js             # Environment config
│   │   ├── controllers/
│   │   │   ├── ai.controller.js   # AI pipeline controller
│   │   │   └── design.controller.js
│   │   ├── middleware/
│   │   │   ├── error.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── models/
│   │   │   ├── Design.js
│   │   │   ├── DesignVersion.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── ai.routes.js
│   │   │   └── design.routes.js
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── aiPipeline.service.js  # Main orchestrator
│   │   │   │   ├── textAI.service.js      # Text AI abstraction
│   │   │   │   ├── imageAI.service.js     # Image AI abstraction
│   │   │   │   ├── prompt.service.js      # Prompt builder
│   │   │   │   ├── imagePrompt.service.js # Image prompt builder
│   │   │   │   └── mockAI.service.js      # Demo mode data
│   │   │   ├── design/
│   │   │   │   └── design.service.js
│   │   │   ├── location/
│   │   │   │   └── location.service.js
│   │   │   └── upload/
│   │   │       └── upload.service.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── validators.js
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/               # Local file uploads
│   ├── .env                   # Your env vars (not committed)
│   ├── .env.example           # Template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── chat/
    │   │   │   ├── ChatInput.jsx
    │   │   │   └── ChatMessage.jsx
    │   │   ├── design/
    │   │   │   ├── DesignExplanation.jsx
    │   │   │   ├── DesignForm.jsx
    │   │   │   ├── DesignHistory.jsx
    │   │   │   ├── DesignProgress.jsx
    │   │   │   └── DesignResult.jsx
    │   │   └── layout/
    │   │       ├── Header.jsx
    │   │       └── Sidebar.jsx
    │   ├── context/
    │   │   └── DesignContext.jsx  # Global state (useReducer)
    │   ├── hooks/
    │   │   └── useDesign.js       # Design operations hook
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── NewDesign.jsx
    │   │   ├── DesignResultPage.jsx
    │   │   └── History.jsx
    │   ├── services/
    │   │   ├── api.js             # Axios base instance
    │   │   └── designApi.js       # Design API methods
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Installation

### Prerequisites
- Node.js v20+ 
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- AI API Keys (optional — demo mode works without them)

### 1. Clone / Download

```bash
cd VastuVision-AI
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

Copy the example file and fill in your values:

```bash
cd backend
copy .env.example .env
```

### Key Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/vastuvision` |
| `AI_MOCK_MODE` | **`true`** for demo (no API key needed) | `true` |
| `AI_TEXT_PROVIDER` | `gemini` / `openai` / `anthropic` | `gemini` |
| `AI_TEXT_API_KEY` | Your text AI API key | _(empty)_ |
| `AI_TEXT_MODEL` | Model name | `gemini-1.5-flash` |
| `AI_IMAGE_PROVIDER` | `openai` / `stability` | `openai` |
| `AI_IMAGE_API_KEY` | Your image AI API key | _(empty)_ |
| `AI_IMAGE_MODEL` | Image model | `dall-e-3` |
| `UPLOAD_PROVIDER` | `local` / `cloudinary` / `s3` | `local` |

### Getting AI API Keys

- **Google Gemini:** [aistudio.google.com](https://aistudio.google.com) → Get API key
- **OpenAI:** [platform.openai.com](https://platform.openai.com) → API Keys
- **Stability AI:** [platform.stability.ai](https://platform.stability.ai) → API Keys

---

## ▶️ Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

Backend runs at: `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Verify

Open `http://localhost:5173` in your browser. You should see the VastuVision AI home page.  
The green "Backend connected" badge confirms the API is reachable.

---

## 📡 API Endpoints

### AI Endpoints

| Method | URL | Description |
|---|---|---|
| `POST` | `/api/ai/design` | **Full pipeline** — analyze + generate image |
| `POST` | `/api/ai/analyze` | Analysis only (no image generation) |

### Design CRUD

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/designs` | List design history |
| `GET` | `/api/designs/:id` | Get single design |
| `DELETE` | `/api/designs/:id` | Delete design |
| `POST` | `/api/designs/:id/refine` | Chat refinement |

### Other

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/health` | Health check + status |

---

## 🤖 AI Pipeline

```
User Input (form + photos)
        ↓
validateDesignRequest (middleware)
        ↓
normalizeLocation (location.service.js)
        ↓
processUploads (upload.service.js)
        ↓
buildDesignPrompt (prompt.service.js)
  → Location context
  → Room specifications
  → Vastu principles
  → JSON output format
        ↓
generateText (textAI.service.js)
  → Gemini | OpenAI | Anthropic | MOCK
        ↓
extractJSON + validateDesignSpec
  → Retry on parse failure
  → Fallback to mock on persistent failure
        ↓
buildImagePrompt (imagePrompt.service.js)
  → 6-view composite image prompt
  → Room-type specific views
        ↓
generateImage (imageAI.service.js)
  → DALL-E 3 | Stability AI | MOCK
        ↓
createDesign (design.service.js)
  → Save to MongoDB
        ↓
Return JSON response to frontend
```

---

## ⚡ Mock / Demo Mode

Set `AI_MOCK_MODE=true` in `backend/.env` (this is the default).

In mock mode:
- No external AI API calls are made
- Realistic sample design data is returned instantly
- The full frontend-to-backend flow is demonstrated
- A yellow "Demo Mode" badge appears in the header

To use real AI, set `AI_MOCK_MODE=false` and add valid API keys.

---

## 📬 Example Request

```bash
curl -X POST http://localhost:5000/api/ai/design \
  -H "x-session-id: demo-session" \
  -F "location=Airoli, Navi Mumbai" \
  -F "roomType=bedroom" \
  -F "areaSqFt=400" \
  -F "occupants=4" \
  -F "budget=medium" \
  -F "designStyle=modern_indian" \
  -F 'requirements=["Queen bed", "study table", "good ventilation"]'
```

### Example Response (abbreviated)

```json
{
  "success": true,
  "data": {
    "designId": "...",
    "isMockData": true,
    "imageUrl": "https://...",
    "designSpec": {
      "projectSummary": "A thoughtfully designed 400 sq ft bedroom...",
      "vastuAnalysis": {
        "bed": {
          "recommendation": "Place the bed with the headboard against the South wall.",
          "reason": "According to traditional Vastu beliefs, sleeping with the head toward South...",
          "type": "both"
        }
      },
      "spacePlan": { "zones": [...], "furniture": [...] },
      "designStyle": { "colors": [...], "materials": [...] }
    }
  }
}
```

---

## 🔭 Future Improvements

| Feature | Description |
|---|---|
| More Indian cities | Expand beyond Mumbai / Navi Mumbai |
| GPS / Geolocation | Auto-detect location and compass direction |
| AR Visualization | Augmented reality room preview |
| 3D Floor Plans | Generate 3D spatial models |
| Furniture Shopping | Link recommendations to shopping platforms |
| Budget Estimation | Cost estimation for materials and labor |
| Hindi / Marathi | Regional language support |
| Voice Input | Voice-based requirement entry |
| User Authentication | Accounts with design portfolios |
| Floor Plan Upload | CAD / PNG floor plan analysis |
| Multiple AI Providers | UI to switch providers per request |

---

## 👨‍🎓 Academic Context

This is a college final-year project demonstrating:

1. **Full-stack MERN development**
2. **AI API integration** with modular provider abstraction
3. **Prompt engineering** for structured JSON output
4. **Cultural knowledge systems** (Vastu Shastra) integrated with AI
5. **Ethical AI presentation** — cultural vs. scientific distinction
6. **Production-quality code** — modular, documented, maintainable

---

*Built with ❤️ as a college AI project — VastuVision AI*
