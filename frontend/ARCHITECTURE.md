# Architecture Documentation

**Purpose:** Comprehensive guide to understanding how Vision Lab works behind the scenes.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Component Structure](#component-structure)
4. [State Management](#state-management)
5. [3D Rendering Pipeline](#3d-rendering-pipeline)
6. [User Interaction Flow](#user-interaction-flow)
7. [Data Flow](#data-flow)
8. [Key Design Decisions](#key-design-decisions)

---

## System Overview

Vision Lab is a browser-based 3D application built with React and Three.js. It follows a modular architecture where each component has a single, well-defined responsibility.

### Technology Stack

```
┌─────────────────────────────────────────┐
│         React 18 + TypeScript          │
│         (Component Framework)           │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌─────────▼─────────┐
│ react-three-   │    │   Zustand Store   │
│ fiber (R3F)    │    │  (State Mgmt)     │
│ (3D Rendering) │    │                   │
└───────┬────────┘    └─────────┬─────────┘
        │                       │
        └───────────┬───────────┘
                    │
        ┌───────────▼───────────┐
        │    Three.js Core      │
        │   (WebGL Renderer)    │
        └───────────────────────┘
```

**Key Libraries:**
- **React**: Component-based UI framework
- **TypeScript**: Type safety and better DX
- **react-three-fiber**: Declarative Three.js wrapper
- **@react-three/drei**: Helper components (OrbitControls, TransformControls)
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first styling

---

## Architecture Patterns

### 1. Modular Component Architecture

Every feature is broken into small, reusable components following the **Single Responsibility Principle**.

```
App (Root)
├── Layout (Layout System)
│   ├── Header
│   ├── Sidebar (ObjectLibrary)
│   ├── Main (3D Viewport)
│   └── PropertiesPanel
├── Toolbar (Actions)
└── Canvas (3D Scene)
    ├── SceneContent
    │   ├── Ground (Placement Surface)
    │   └── ObjectRenderer[] (Placed Objects)
    └── OrbitControls (Camera)
```

### 2. Two-Tiered State Management

**Application State (Zustand):**
- Object list, selection, placement mode
- Changes trigger React re-renders
- Persisted across component unmounts

**Transient State (useFrame):**
- Per-frame animations
- Transform updates during manipulation
- No React re-renders

```typescript
// Application State (Zustand)
const objects = useSceneStore(state => state.objects);
const selectedId = useSceneStore(state => state.selectedObjectId);

// Transient State (useFrame)
useFrame(() => {
  // Update object animation without React re-render
  meshRef.current.rotation.y += 0.01;
});
```

### 3. Component Composition

Components compose together to build complex features:

```typescript
// Simple components compose into complex UI
<Layout>
  <Toolbar />
  <Canvas>
    <SceneContent />
  </Canvas>
</Layout>
```

---

## Component Structure

### Core Components

#### 1. **App.tsx** - Root Component
**Responsibility:** Initializes the 3D canvas and layout

```typescript
function App() {
  return (
    <Layout>
      <Toolbar />
      <Canvas camera={{ position: [10, 10, 10] }}>
        <SceneContent />
        <OrbitControls />
      </Canvas>
    </Layout>
  );
}
```

**Key Decisions:**
- Canvas setup with camera configuration
- Lighting configured once at root level
- OrbitControls for camera manipulation

#### 2. **Layout.tsx** - Layout System
**Responsibility:** Page structure and panel organization

**Structure:**
```
┌─────────────────────────────────────────┐
│              Header                     │
├──────────┬──────────────────┬───────────┤
│          │                  │           │
│ Sidebar  │   3D Viewport    │ Properties│
│ (Objects)│                  │  Panel    │
│          │                  │           │
└──────────┴──────────────────┴───────────┘
```

**Design Pattern:** Composition over inheritance

#### 3. **SceneContent.tsx** - Scene Composition
**Responsibility:** Renders all 3D scene elements

```typescript
export function SceneContent() {
  const objects = useSceneStore(state => state.objects);
  
  return (
    <>
      <Ground />
      {objects.map(obj => (
        <ObjectRenderer key={obj.id} object={obj} />
      ))}
    </>
  );
}
```

**Key Pattern:** Map over state to render dynamic objects

#### 4. **Ground.tsx** - Placement Surface
**Responsibility:** Handles click-to-place interactions

**How It Works:**
1. User clicks object type in library → `placingType` set
2. Ground detects click → raycasts to get 3D point
3. Creates new object at intersection point
4. Adds to store → triggers re-render

```typescript
const handleClick = (event) => {
  if (!placingType) return;
  
  event.stopPropagation();
  const { point } = event; // 3D intersection point
  
  const newObject = {
    id: createId(),
    type: placingType,
    position: { x: point.x, y: point.y + 0.5, z: point.z },
    // ...
  };
  
  addObject(newObject);
};
```

**Visual Explanation:**
```
User clicks ground
    ↓
Raycaster detects intersection
    ↓
3D point extracted from event
    ↓
Object created at point
    ↓
Added to store → React re-renders → Object appears
```

#### 5. **ObjectRenderer.tsx** - Object Rendering
**Responsibility:** Renders individual 3D objects with interaction

**Features:**
- Different geometries per object type
- Transform controls when selected
- Click handling for selection

**Rendering Logic:**
```typescript
const renderGeometry = () => {
  switch (object.type) {
    case 'camera': return <boxGeometry + blue material />
    case 'bin': return <boxGeometry + red wireframe />
    case 'obstacle': return <boxGeometry + orange material />
    case 'robot': return <boxGeometry + purple material />
  }
};
```

**Transform Controls:**
- Only shown when object selected
- Provides visual gizmo for manipulation
- Updates store on change

#### 6. **ObjectLibrary.tsx** - Object Selection UI
**Responsibility:** UI for selecting object types to place

**Interaction Flow:**
```
Click object type
    ↓
setPlacingMode(type)
    ↓
Ground highlights (green)
    ↓
Click ground → Object placed
```

#### 7. **PropertiesPanel.tsx** - Object Properties Editor
**Responsibility:** Edit selected object properties

**Features:**
- Position editing (x, y, z)
- Rotation editing
- Delete functionality
- Real-time updates to store

---

## State Management

### Zustand Store Structure

```typescript
interface SceneStore {
  // State
  objects: SceneObject[];
  selectedObjectId: string | null;
  placingType: ObjectType | null;
  
  // Actions
  addObject: (object: SceneObject) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  setPlacingMode: (type: ObjectType | null) => void;
}
```

### State Flow Diagram

```
┌─────────────┐
│ User Action │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Zustand Store   │
│ (State Update)  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ React Re-render │
│ (Components)    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 3D Scene Update │
│ (Visual Change)  │
└─────────────────┘
```

### Why Zustand?

1. **Minimal Boilerplate**: No providers, no context
2. **Performance**: Only subscribed components re-render
3. **TypeScript**: Full type safety
4. **Simple API**: Easy to understand and use

---

## 3D Rendering Pipeline

### How react-three-fiber Works

**Traditional Three.js (Imperative):**
```javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer();
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
renderer.render(scene, camera);
```

**react-three-fiber (Declarative):**
```jsx
<Canvas>
  <mesh>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>
</Canvas>
```

**R3F automatically:**
- Creates scene, camera, renderer
- Manages render loop
- Handles object lifecycle
- Provides React hooks for interaction

### Rendering Flow

```
React Component Tree
    ↓
JSX Elements
    ↓
react-three-fiber converts to Three.js objects
    ↓
Three.js Scene Graph
    ↓
WebGL Renderer
    ↓
GPU Drawing
    ↓
Screen Display
```

### Scene Graph Structure

```
Scene (root)
├── AmbientLight
├── DirectionalLight
├── Ground (Mesh)
│   ├── PlaneGeometry
│   └── MeshStandardMaterial
└── ObjectRenderer[] (Mesh)
    ├── BoxGeometry
    ├── MeshStandardMaterial
    └── TransformControls (when selected)
```

---

## User Interaction Flow

### Complete Object Placement Flow

```
1. User clicks "Camera" in ObjectLibrary
   ↓
2. setPlacingMode('camera') called
   ↓
3. Ground changes color (visual feedback)
   ↓
4. User clicks ground plane
   ↓
5. Ground's onClick handler fires
   ↓
6. Raycaster provides 3D intersection point
   ↓
7. New SceneObject created with:
   - Unique ID
   - Position from intersection point
   - Default rotation/scale
   ↓
8. addObject(newObject) called
   ↓
9. Store updates: objects array + selectedObjectId
   ↓
10. React re-renders SceneContent
   ↓
11. ObjectRenderer component created for new object
   ↓
12. Three.js mesh added to scene
   ↓
13. TransformControls attached (object selected)
   ↓
14. Object appears in 3D viewport
```

### Object Selection Flow

```
1. User clicks object mesh
   ↓
2. onClick handler fires (event.stopPropagation())
   ↓
3. selectObject(object.id) called
   ↓
4. Store updates: selectedObjectId
   ↓
5. React re-renders ObjectRenderer components
   ↓
6. Selected object's TransformControls appear
   ↓
7. PropertiesPanel updates with object data
```

### Transform Manipulation Flow

```
1. User drags TransformControls gizmo
   ↓
2. onChange fires continuously during drag
   ↓
3. handleTransformChange() extracts position/rotation/scale
   ↓
4. updateObject(id, updates) called
   ↓
5. Store updates object in array
   ↓
6. React re-renders ObjectRenderer
   ↓
7. Mesh position/rotation/scale update
   ↓
8. Visual update in viewport
```

---

## Data Flow

### Unidirectional Data Flow

```
┌──────────────┐
│   User UI    │
│  (Actions)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Zustand Store│
│  (Single     │
│  Source of   │
│  Truth)      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   React      │
│ Components   │
│ (View)       │
└──────────────┘
```

### Example: Adding an Object

```
1. User Action:
   ObjectLibrary → onClick → setPlacingMode('camera')
   
2. Store Update:
   placingType: null → 'camera'
   
3. UI Update:
   Ground component reads placingType → changes color
   
4. User Action:
   Ground → onClick → handleGroundClick()
   
5. Object Creation:
   Creates SceneObject with ID, position, etc.
   
6. Store Update:
   addObject(newObject) → objects array updated
   
7. Component Update:
   SceneContent reads objects → maps to ObjectRenderer
   
8. Render:
   New mesh appears in 3D scene
```

---

## Key Design Decisions

### 1. Why react-three-fiber?

**Problem:** Three.js is imperative, React is declarative  
**Solution:** R3F bridges the gap

**Benefits:**
- Use React knowledge for 3D
- Component-based 3D scenes
- React hooks for 3D state
- Automatic cleanup

### 2. Why Two-Tiered State?

**Problem:** Frequent updates (60fps) would cause excessive React re-renders  
**Solution:** Separate application state from transient state

**Application State (Zustand):**
- Object list, selection
- Changes trigger React updates
- User-initiated actions

**Transient State (useFrame):**
- Animations, transforms
- No React re-renders
- Performance-critical updates

### 3. Why Component-Based Architecture?

**Benefits:**
- Single Responsibility: Each component does one thing
- Reusability: Components can be composed
- Testability: Easy to test isolated components
- Maintainability: Clear structure, easy to understand

### 4. Why Zustand over Redux?

**Reasons:**
- Less boilerplate (no actions, reducers)
- Simpler API
- Better TypeScript support
- Smaller bundle size
- Perfect for this use case

### 5. Modular Utilities

**Why extract utilities?**
- DRY principle: Don't repeat code
- Testability: Test logic separately
- Reusability: Use across components

**Example:**
```typescript
// Instead of duplicating this everywhere:
const id = `${Date.now()}-${Math.random()}`;

// We have:
const id = createId(); // Reusable utility
```

---

## Performance Optimizations

### 1. Memoization

```typescript
// Memoize expensive calculations
const geometry = useMemo(() => new BoxGeometry(), []);
```

### 2. Selective Re-renders

```typescript
// Only subscribe to needed state
const objects = useSceneStore(state => state.objects);
// Component only re-renders when objects change
```

### 3. On-Demand Rendering (Future)

```typescript
<Canvas frameloop="demand">
  {/* Only renders when scene changes */}
</Canvas>
```

### 4. InstancedMesh (Future)

```typescript
// For many identical objects
<InstancedMesh count={100}>
  {/* Single draw call for 100 objects */}
</InstancedMesh>
```

---

## Code Examples

### Complete Object Placement

```typescript
// 1. User selects object type
const handleObjectClick = (type: ObjectType) => {
  setPlacingMode(type === placingType ? null : type);
};

// 2. Ground detects click
const handleGroundClick = (event: any) => {
  if (!placingType) return;
  
  event.stopPropagation();
  const { point } = event; // 3D intersection point
  
  // 3. Create object
  const newObject: SceneObject = {
    id: createId(),
    type: placingType,
    position: { x: point.x, y: point.y + 0.5, z: point.z },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    properties: {},
  };
  
  // 4. Add to store
  addObject(newObject);
};
```

### Object Selection and Manipulation

```typescript
// ObjectRenderer component
const handleClick = (event: any) => {
  event.stopPropagation(); // Prevent ground click
  selectObject(object.id); // Update store
};

const handleTransformChange = () => {
  if (!meshRef.current) return;
  
  // Extract transform from Three.js object
  const { position, rotation, scale } = meshRef.current;
  
  // Update store
  updateObject(object.id, {
    position: { x: position.x, y: position.y, z: position.z },
    rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
    scale: { x: scale.x, y: scale.y, z: scale.z },
  });
};
```

---

## Extending the System

### Adding a New Object Type

1. **Update Types:**
```typescript
export type ObjectType = 'camera' | 'bin' | 'obstacle' | 'robot' | 'newType';
```

2. **Add to Library:**
```typescript
const OBJECT_TYPES = [
  // ... existing types
  { type: 'newType', label: 'New Type', icon: '🔧' },
];
```

3. **Add Rendering Logic:**
```typescript
case 'newType':
  return (
    <>
      <cylinderGeometry args={[0.5, 0.5, 1]} />
      <meshStandardMaterial color="#00ff00" />
    </>
  );
```

### Adding a New Feature

1. **Define State:** Add to Zustand store
2. **Create Component:** Following single responsibility
3. **Compose:** Add to Layout or SceneContent
4. **Wire Up:** Connect to store actions

---

## Summary

**Key Takeaways:**

1. **Modular Architecture:** Everything is a component
2. **Single Responsibility:** Each component does one thing
3. **State Management:** Zustand for app state, useFrame for transient
4. **3D Rendering:** react-three-fiber bridges React and Three.js
5. **Data Flow:** Unidirectional, predictable
6. **Performance:** Optimized for 60fps rendering

**After reading this, you should understand:**
- How components interact
- How state flows through the system
- How 3D rendering works
- How user interactions are handled
- How to extend the system

**Next Steps:**
- Explore the codebase
- Try adding features
- Experiment with components
- Understand the patterns

---

*Built with ❤️ following industry best practices*

