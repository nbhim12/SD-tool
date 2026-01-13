# IGBC Green Homes Certification Tool

An interactive feasibility assessment tool for IGBC Green Homes Certification, helping sustainability consultants evaluate green building certification requirements.

## 🏗️ Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB (Atlas or Local) + Mongoose
- **State Management:** Zustand
- **PDF Generation:** jsPDF + jspdf-autotable

## 📁 Project Structure

```
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── services/       # API Services
│   │   ├── store/          # Zustand State Store
│   │   └── utils/          # Utility Functions (PDF export)
│   └── package.json
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Route Controllers
│   │   ├── models/         # Mongoose Models
│   │   ├── routes/         # API Routes
│   │   ├── config/         # Database Configuration
│   │   └── index.ts        # Server Entry Point
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

- **Node.js** >= 18.0.0
- **MongoDB** - Choose one:
  - [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud - Recommended for quick setup)
  - MongoDB Community Server (Local installation)
- **npm** (comes with Node.js)

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd SD-tool
```

#### 2. Install all dependencies

```bash
# Install root, client, and server dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

Or use the convenience script:
```bash
npm run install:all
```

#### 3. Configure MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string

**Option B: Local MongoDB**

1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/igbc-tool`

#### 4. Set up environment variables

Create the server environment file:

```bash
# Create .env file in server directory
cd server
```

Create `server/.env` with the following content:

```env
# MongoDB Connection
# For Atlas: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/igbc-tool?retryWrites=true&w=majority
# For Local: mongodb://localhost:27017/igbc-tool
MONGODB_URI=your_mongodb_connection_string_here

# Server Port (optional, defaults to 5000)
PORT=5000

# Node Environment
NODE_ENV=development
```

> ⚠️ **Important:** Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string. For Atlas, make sure to replace `<password>` with your database user password.

#### 5. Seed the database (required for first run)

```bash
cd server
npm run seed
```

This populates the database with IGBC categories, credits, and certification levels.

#### 6. Start the application

**Development Mode (with hot reload):**

Open **two terminal windows**:

```bash
# Terminal 1 - Backend Server
cd server
npm run dev
```

```bash
# Terminal 2 - Frontend Client
cd client
npm run dev
```

**Or run both from root:**
```bash
npm run dev
```

#### 7. Access the application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

### Verify Installation

1. Open http://localhost:5000/api/health - should return `{"status":"ok"}`
2. Open http://localhost:5173 - should display the IGBC Tool interface
3. Categories should load in the tab navigation

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` on API calls | Ensure backend server is running (`npm run dev` in server folder) |
| MongoDB connection failed | Check your `MONGODB_URI` in `.env`, ensure Atlas IP whitelist includes your IP |
| Port 5000 already in use | Change `PORT` in `.env` or stop the conflicting process |
| CORS errors | Backend accepts requests from ports 5173 and 5174 by default |
| Categories not loading | Run `npm run seed` in server folder to populate database |

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

- [x] Project structure & monorepo setup
- [x] Category navigation with tabs
- [x] Credit display with point distribution
- [x] Yes/Maybe/No point allocation
- [x] Notes per credit
- [x] Mandatory requirements tracking
- [x] Real-time points calculation
- [x] Certification level display
- [x] Save/Load scenarios
- [x] PDF export with detailed report

## 🎯 Design Decisions

1. **Monorepo Structure:** Easier to share types between frontend and backend
2. **Zustand for State:** Lightweight and TypeScript-friendly
3. **Tab Navigation:** Top navigation for categories as per requirements
4. **Responsive Design:** Mobile-first approach with Tailwind CSS
5. **Client-side PDF:** Uses jsPDF for browser-based PDF generation

## 🛠️ Available Scripts

### Root Directory
| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server in development mode |
| `npm run install:all` | Install dependencies for all packages |

### Server (`/server`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with hot-reload (ts-node-dev) |
| `npm run build` | Build TypeScript to JavaScript |
| `npm run seed` | Seed database with IGBC data |
| `npm start` | Start production server |

### Client (`/client`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 📄 License

MIT
