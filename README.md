# Vision Lab - Robotic Vision Simulation Platform

Browser-based simulation platform for designing and visualizing robotic vision systems.

**Live Site:** https://visionlab.aviralgarg.com

---

## Quick Start

```bash
# Frontend development
cd frontend
npm install
npm run dev

# Build for production
npm run build

# Deploy infrastructure
cd infrastructure
npm install
cdk deploy
```

---

## Tech Stack

**Frontend:** React 18+, TypeScript, react-three-fiber, Zustand, Tailwind CSS, Vite  
**Backend:** Python 3.13, AWS Lambda, API Gateway  
**Infrastructure:** AWS CDK, S3, CloudFront, Route53

---

## Project Structure

```
visionlab/
├── frontend/          # React frontend application
├── backend/           # Python Lambda backend
├── infrastructure/    # AWS CDK infrastructure
└── reference/         # Documentation and research
```

---

## Documentation

All detailed documentation is in the `reference/` folder:

- **Roadmap:** `reference/roadmap.md`
- **Architecture:** `reference/ARCHITECTURE.md`
- **Implementation:** `reference/IMPLEMENTATION.md`
- **Research:** `reference/RESEARCH.md`
- **Audit Reports:** `reference/AUDIT_REPORT.md`, `reference/COMPLIANCE_VERIFIED.md`

---

## Project Rules

1. **Do not commit:** `prompts/` folder (personal workflow)
2. **Do not commit:** `reference/` folder (research/documentation)

---

**Last Updated:** 2025-10-31
