# Vision Lab - Robotic Vision Simulation Platform

**End Goal:** Professional browser-based robotic vision simulation platform demonstrating React/TypeScript/Three.js mastery, aligned with AperaAI's needs. Impress interviewers by showing deep understanding of their domain (robotic vision, simulation, AI training) combined with exceptional frontend engineering skills.

**Current Status:** Phase 2 In Progress - EOAT Camera System Implemented ✅

**Live Site:** https://visionlab.aviralgarg.com

---

## Project Overview

Vision Lab is a browser-based no-code simulation platform for designing and visualizing robotic vision systems. Built with modern web technologies to demonstrate technical excellence in 3D interfaces, component architecture, and user experience design.

**Vision:** Make robotic vision system design accessible through intuitive browser-based tools, enabling rapid prototyping and visualization without hardware dependencies.

---

## Key Features

### Phase 1: Foundation ✅ COMPLETE
- **No-Code 3D Design**: Intuitive drag-and-place interface for robotic cell layout
- **Real-Time Visualization**: Interactive 3D scene with camera, bin, obstacle, robot, and gripper placement
- **Transform Controls**: Visual manipulation of objects
- **Properties Panel**: Edit object properties in real-time
- **Save/Load**: Export and import scene configurations
- **Professional UI/UX**: Smooth animations, intuitive interactions

### Phase 2: Core Simulation & Vision Focus 🔄 IN PROGRESS
- ✅ **EOAT Camera System** (eye-in-hand + eye-to-hand) - Core differentiator
- ✅ **Gripper Object Type** - Separate from robot for accurate simulation
- ✅ **Robot Movement System** - Path following animation
- ⏳ Camera frustum visualization - **NEXT**
- ⏳ Vision validation system
- ⏳ Collision detection & Obstacle Autopilot

### Upcoming Phases
- **Phase 3**: Domain-specific workflows (de-racking, bin picking)
- **Phase 4**: Synthetic data generation (core value proposition)
- **Phase 5**: CAD integration & digital twins
- **Phase 6**: Production polish & export to Apera Vue

---

## Tech Stack

**Frontend:**
- React 18+ (TypeScript)
- react-three-fiber (3D rendering)
- @react-three/drei (3D helpers)
- Zustand (state management)
- Tailwind CSS (styling)
- Vite (build tool)

**Backend:**
- Python 3.13 (Lambda)
- AWS API Gateway (HTTP API)

**Infrastructure:**
- AWS CDK (TypeScript)
- S3 + CloudFront + Route53
- Lambda for backend API

---

## Project Structure

```
vision-lab/
├── frontend/           # React/TypeScript frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   │   ├── scene/  # 3D scene components
│   │   │   ├── objects/# Object renderers
│   │   │   └── ui/     # UI components
│   │   ├── stores/     # Zustand state management
│   │   ├── types/      # TypeScript types
│   │   └── utils/      # Utility functions
│   └── ARCHITECTURE.md # Frontend architecture docs
├── backend/            # Python Lambda backend
├── infrastructure/     # AWS CDK infrastructure
├── docs/              # Project documentation
└── README.md          # This file
```

---

## Development Principles

Following design principles from `prompts/design_principles.md`:

- **Extreme Modularity**: Every component single-purpose, reusable, composable
- **SOLID Principles**: Applied rigorously throughout codebase
- **DRY**: Utilities extracted, no code duplication
- **Type Safety**: Comprehensive TypeScript coverage
- **Vision-First Approach**: Camera placement > Robot mechanics (aligned with AperaAI)
- **Professional-Grade UX**: Smooth animations, intuitive interactions
- **Performance First**: Optimized rendering, selective updates, efficient state management

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured (for deployment)
- Python 3.13 (for backend)

### Development

```bash
# Frontend development
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173

# Build for production
npm run build

# Deploy infrastructure
cd infrastructure
npm install
cdk deploy
```

---

## Documentation

- **Roadmap**: See `reference/roadmap.md` for complete project roadmap
- **Architecture**: See `frontend/ARCHITECTURE.md` for frontend architecture details
- **Implementation Plan**: See `docs/IMPLEMENTATION.md` for Phase 2 implementation details
- **Research**: See `docs/RESEARCH.md` for AperaAI research analysis

---

## Project Rules

1. Do not commit the `prompts/` folder
2. Do not commit the `reference/` folder
3. Follow design principles at every step
4. Vision-first approach: Camera placement > Robot mechanics

---

## Current Progress

**Phase 2 Accomplishments:**
- ✅ Type system extended (gripper, paths, simulation)
- ✅ Store extended (paths, simulation state)
- ✅ Robot movement system implemented
- ✅ EOAT camera system implemented (eye-in-hand + eye-to-hand)
- ✅ Gripper object type added

**Next Priority:** Camera frustum visualization

---

**Last Updated:** 2025-10-31  
**Status:** Phase 2 In Progress - EOAT Camera System Complete ✅
