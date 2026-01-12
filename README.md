# IGBC Green Homes Certification Tool

An interactive feasibility assessment tool for IGBC Green Homes Certification, helping sustainability consultants evaluate green building certification requirements.

## 🏗️ Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB + Mongoose
- **State Management:** Zustand
- **PDF Generation:** PDFKit

## 📁 Project Structure

```
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── services/       # API Services
│   │   ├── store/          # Zustand State Store
│   │   ├── types/          # TypeScript Types
│   │   └── utils/          # Utility Functions
│   └── package.json
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Route Controllers
│   │   ├── models/         # Mongoose Models
│   │   ├── routes/         # API Routes
│   │   ├── services/       # Business Logic
│   │   └── utils/          # Utility Functions
│   └── package.json
│
├── shared/                 # Shared Code
│   ├── types/              # Shared TypeScript Interfaces
│   └── data/               # IGBC Data (Categories, Credits)
│
└── package.json            # Root Monorepo Config
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SD-tool
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Server
   cp server/.env.example server/.env
   # Edit server/.env with your MongoDB URI
   ```

4. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📊 IGBC Green Homes Categories

| Category | Code | Points |
|----------|------|--------|
| Sustainable Design | SD | 20 |
| Water Conservation | WC | 23 |
| Energy Efficiency | EE | 20 |
| Materials and Resources | MR | 18 |
| Resident Health & Wellbeing | RHW | 14 |
| Innovation & Design | ID | 5 |
| **Total** | | **100** |

## 🏆 Certification Levels

| Level | Points Required |
|-------|-----------------|
| Certified | 40-49 |
| Silver | 50-59 |
| Gold | 60-74 |
| Platinum | 75-100 |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/categories` | Get all categories with credits |
| GET | `/api/scenarios` | List saved scenarios |
| GET | `/api/scenarios/:id` | Get single scenario |
| POST | `/api/scenarios` | Create new scenario |
| PUT | `/api/scenarios/:id` | Update scenario |
| DELETE | `/api/scenarios/:id` | Delete scenario |
| GET | `/api/scenarios/:id/pdf` | Download PDF report |

## 📝 Features

- [x] Project structure & setup
- [ ] Category navigation with tabs
- [ ] Credit display with point distribution
- [ ] Yes/Maybe/No point allocation
- [ ] Notes per credit
- [ ] Certification level selection
- [ ] Save/Load scenarios
- [ ] PDF export

## 🎯 Design Decisions

1. **Monorepo Structure:** Easier to share types between frontend and backend
2. **Zustand for State:** Lightweight and TypeScript-friendly
3. **Tab Navigation:** Top navigation for categories as per requirements
4. **Responsive Design:** Mobile-first approach with Tailwind CSS

## 📄 License

MIT
