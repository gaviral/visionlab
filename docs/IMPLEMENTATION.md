# Phase 2 Implementation Plan: Core Simulation & Vision Focus

**Goal:** Vision-first simulation focusing on camera placement, EOAT, and vision validation.

**Strategic Value:** Demonstrates understanding that vision is AperaAI's core technology (not robot mechanics). Shows vision-first thinking aligned with Vue/Forge products.

**Vision-First Approach:** Camera placement and validation are MORE IMPORTANT than robot movement mechanics.

---

## Architecture Overview

Following design principles: Extreme modularity, SOLID, DRY.

### Component Hierarchy
```
SceneContent
├── Ground
├── ObjectRenderer[] (existing)
├── CameraSystem (new) - PRIORITY 1
│   ├── EyeInHandCamera (new)
│   ├── EyeToHandCamera (new)
│   └── CameraFrustum (new)
├── VisionValidationSystem (new) - PRIORITY 2
│   ├── FieldOfViewCalculator
│   ├── VisibilityChecker
│   └── LightingSimulator
├── GripperSystem (new) - PRIORITY 3
│   └── GripperAttachment
├── RobotMovementSystem (new) - PRIORITY 4
│   └── PathVisualizer (new)
└── CollisionDetector (new) - PRIORITY 5
```

---

## Implementation Steps

### Step 1: Extend Type System ✅ COMPLETE
**File:** `frontend/src/types/index.ts`

**Additions:**
- `RobotObject` interface with movement properties ✅
- `GripperObject` interface ✅ NEW
- `CameraObject` with `cameraType` and `parentRobotId` (for eye-in-hand) ✅
- `SimulationState` interface ✅
- `PathWaypoint` interface ✅
- `Path` interface ✅

**Why:** Type safety foundation for all Phase 2 features.

**Status:** ✅ Complete - Added gripper type, simulation types, path types

---

### Step 2: Extend Store ✅ COMPLETE
**File:** `frontend/src/stores/sceneStore.ts`

**Additions:**
- `paths`: `Path[]` ✅
- `simulation`: `SimulationData` with state, progress, currentPathId, speed ✅
- Actions: `addPath`, `removePath`, `updatePath` ✅
- Actions: `startSimulation`, `pauseSimulation`, `stopSimulation`, `setSimulationProgress`, `setSimulationSpeed` ✅

**Why:** Centralized state management for simulation features.

**Status:** ✅ Complete - Store extended with paths and simulation state

---

### Step 3: Camera System (EOAT) - PRIORITY 1
**File:** `frontend/src/components/scene/CameraSystem.tsx`

**Responsibility:** Handle eye-in-hand and eye-to-hand cameras

**Features:**
- Mode switching (eye-in-hand ↔ eye-to-hand)
- Eye-in-hand: Camera follows robot end effector (via gripper)
- Eye-to-hand: Fixed camera position
- Camera frustum visualization
- Real-time position updates during robot movement

**Dependencies:** Step 1, Step 2

**Why First:** Vision is the core technology. EOAT is critical differentiator.

---

### Step 4: Camera Frustum Visualization - PRIORITY 1.5
**File:** `frontend/src/components/scene/CameraFrustum.tsx`

**Responsibility:** Visualize camera field of view

**Features:**
- Frustum wireframe rendering
- Updates based on camera FOV
- Real-time updates during robot movement (eye-in-hand)
- Visual feedback for camera placement validation

**Dependencies:** Step 3

---

### Step 5: Vision Validation System - PRIORITY 2
**File:** `frontend/src/components/scene/VisionValidationSystem.tsx`

**Responsibility:** Validate camera placement and vision capabilities

**Features:**
- Field of view calculations
- Object visibility checks (what objects are visible from camera)
- Lighting simulation (affects vision reliability)
- Vision cycle time estimates
- Visual feedback (highlight visible objects, show blind spots)

**Dependencies:** Step 3, Step 4

**Why Second:** Validates camera placement - core use case for Forge.

---

### Step 6: Gripper System - PRIORITY 3
**File:** `frontend/src/components/scene/GripperSystem.tsx`

**Responsibility:** Handle gripper attachment and positioning

**Features:**
- Gripper attachment to robot
- Gripper position calculation (for eye-in-hand camera positioning)
- Gripper visualization
- Gripper-robot relationship management

**Dependencies:** Step 1, Step 2

**Why Third:** Required for accurate eye-in-hand camera positioning.

---

### Step 7: Robot Movement System - PRIORITY 4
**File:** `frontend/src/components/scene/RobotMovementSystem.tsx`

**Responsibility:** Animate robot along path, update position/rotation

**Features:**
- Path interpolation (linear/spline)
- Animation loop using `useFrame`
- Updates robot position in store
- Integration with collision detection

**Dependencies:** Step 1, Step 2

---

### Step 4: Path Visualization
**File:** `frontend/src/components/scene/PathVisualizer.tsx`

**Responsibility:** Visual representation of robot path

**Features:**
- 3D curve rendering (Three.js TubeGeometry)
- Waypoint markers
- Color coding (safe/unsafe/collision)
- Toggle visibility

**Dependencies:** Step 1, Step 2

---

### Step 5: Camera System (EOAT)
**File:** `frontend/src/components/scene/CameraSystem.tsx`

**Responsibility:** Handle eye-in-hand and eye-to-hand cameras

**Features:**
- Mode switching (eye-in-hand ↔ eye-to-hand)
- Eye-in-hand: Camera follows robot end effector
- Eye-to-hand: Fixed camera position
- Camera frustum visualization

**Dependencies:** Step 1, Step 2, Step 6 (gripper positioning)

---

### Step 8: Path Visualization
**File:** `frontend/src/components/scene/PathVisualizer.tsx`

**Responsibility:** Visual representation of robot path

**Features:**
- 3D curve rendering (Three.js TubeGeometry)
- Waypoint markers
- Color coding (safe/unsafe/collision)
- Toggle visibility

**Dependencies:** Step 1, Step 2, Step 7

---

### Step 9: Collision Detection
**File:** `frontend/src/components/scene/CollisionDetector.tsx`

**Responsibility:** Detect collisions between robot and obstacles

**Features:**
- AABB (Axis-Aligned Bounding Box) collision detection
- Per-frame checks during simulation
- Visual feedback (red highlight on collision)
- Path validation before simulation

**Dependencies:** Step 1, Step 2, Step 7

---

### Step 10: Simulation Controls UI
**File:** `frontend/src/components/ui/SimulationControls.tsx`

**Responsibility:** UI for controlling simulation

**Features:**
- Play/Pause/Stop buttons
- Speed slider
- Progress indicator
- Path editor (add/remove waypoints)

**Dependencies:** Step 2

---

### Step 11: Integration
**File:** `frontend/src/components/scene/SceneContent.tsx`

**Updates:**
- Add CameraSystem (PRIORITY 1)
- Add VisionValidationSystem (PRIORITY 2)
- Add GripperSystem (PRIORITY 3)
- Add RobotMovementSystem (PRIORITY 4)
- Add CollisionDetector (PRIORITY 5)
- Add PathVisualizer

**Dependencies:** All previous steps

---

### Step 12: Update Properties Panel
**File:** `frontend/src/components/ui/PropertiesPanel.tsx`

**Updates:**
- Camera mode switching (eye-in-hand/eye-to-hand)
- Camera FOV/resolution settings
- Vision validation results display
- Gripper attachment UI
- Robot path configuration

**Dependencies:** Step 1, Step 2, Step 3, Step 5, Step 6

---

## Technical Implementation Details

### Robot Movement Algorithm
```typescript
// Linear interpolation between waypoints
function interpolatePath(path: Path, progress: number): Vector3 {
  const segmentLength = 1 / (path.waypoints.length - 1);
  const segmentIndex = Math.floor(progress / segmentLength);
  const segmentProgress = (progress % segmentLength) / segmentLength;
  
  const start = path.waypoints[segmentIndex];
  const end = path.waypoints[segmentIndex + 1];
  
  return lerp(start.position, end.position, segmentProgress);
}
```

### Eye-in-Hand Camera Positioning
```typescript
// Camera follows robot end effector
const endEffectorPosition = robot.position + robotEndEffectorOffset;
camera.position = endEffectorPosition;
camera.rotation = robot.rotation; // or calculated based on robot orientation
```

### Collision Detection (AABB)
```typescript
function checkCollision(box1: Box3, box2: Box3): boolean {
  return box1.intersectsBox(box2);
}
```

---

## Success Criteria

- ✅ Robot follows path smoothly (60fps)
- ✅ Eye-in-hand camera follows robot accurately
- ✅ Camera frustum visualization updates in real-time
- ✅ Collision detection works correctly
- ✅ Path visualization clear and editable
- ✅ Mode switching seamless
- ✅ Professional UX (animations, feedback)

---

## Design Principles Applied

1. **Extreme Modularity:** Each component single-purpose, composable
2. **SOLID:** Single responsibility, dependency inversion (store abstraction)
3. **DRY:** Reusable utilities for path math, collision detection
4. **Type Safety:** Comprehensive TypeScript interfaces
5. **Performance:** Use `useFrame` for animations, avoid React re-renders

---

**Next:** Start implementation with Step 1 (Type System Extensions).

