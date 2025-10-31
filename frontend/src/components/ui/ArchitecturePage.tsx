/**
 * ArchitecturePage - Comprehensive, beautiful architecture documentation
 * Following design principles: User-focused, professional polish, extreme modularity
 */
import { useState, useEffect, useMemo } from 'react';
import { ArchitectureNav } from './ArchitectureNav';
import { ArchitectureSection } from './ArchitectureSection';
import { ArchitectureCard } from './ArchitectureCard';

interface Section {
  id: string;
  title: string;
  icon?: string;
  content: string;
}

/* eslint-disable max-lines-per-function */
// Exception: Documentation component with structured content - length is acceptable for content presentation
export function ArchitecturePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections: Section[] = useMemo(() => [
    {
      id: 'overview',
      title: 'System Overview',
      icon: undefined,
      content: `**Purpose:** Understanding how Vision Lab works behind the scenes.

Vision Lab is a browser-based 3D application built with React and Three.js. It follows a modular architecture where each component has a single, well-defined responsibility.

### Technology Stack

- **React 18 + TypeScript**: Component-based UI framework with type safety
- **react-three-fiber**: Declarative Three.js wrapper
- **@react-three/drei**: Helper components (OrbitControls, TransformControls)
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first styling

### Why This Matters

This architecture enables:
- **Modularity**: Easy to add features and modify components
- **Performance**: Optimized rendering with selective updates
- **Maintainability**: Clear separation of concerns
- **Extensibility**: Simple to add new object types and interactions`,
    },
    {
      id: 'patterns',
      title: 'Architecture Patterns',
      icon: undefined,
      content: `### 1. Modular Component Architecture

Every feature is broken into small, reusable components following the **Single Responsibility Principle**.

**Component Hierarchy:**
- App (Root) → Layout → SceneContent → ObjectRenderer
- Each component does ONE thing exceptionally well
- Components compose to build complex features

### 2. Two-Tiered State Management

**Application State (Zustand):**
- Object list, selection, placement mode
- Changes trigger React re-renders
- Persisted across component unmounts

**Transient State (useFrame):**
- Per-frame animations
- Transform updates during manipulation
- No React re-renders (performance)

\`\`\`typescript
// Application State (Zustand)
const objects = useSceneStore(state => state.objects);
const selectedId = useSceneStore(state => state.selectedObjectId);

// Transient State (useFrame)
useFrame(() => {
  // Update object animation without React re-render
  meshRef.current.rotation.y += 0.01;
});
\`\`\`

### 3. Component Composition

Simple components compose together to build complex features:
- **Layout** + **Toolbar** + **Canvas** = Complete UI
- **SceneContent** + **Ground** + **ObjectRenderer[]** = 3D Scene
- Each component is independent and reusable`,
    },
    {
      id: 'components',
      title: 'Component Structure',
      icon: undefined,
      content: `### Core Components

**1. App.tsx** - Root Component
- Initializes the 3D canvas with camera (position: [10, 10, 10], fov: 50)
- Sets up ambient and directional lighting
- Manages view mode switching (simulator ↔ architecture)
- Composes Layout, Toolbar, and Canvas components

**2. Toolbar.tsx** - Actions Toolbar
- Save Scene: Exports current scene to JSON file
- Load Scene: Imports scene from JSON file
- Uses \`configUtils\` for serialization/deserialization
- Positioned absolutely in top-left of viewport

**3. Layout.tsx** - Layout System
- Page structure: Header, Sidebar, Main, Properties Panel
- Composition pattern: Children compose the layout
- Responsive design with overflow handling

**4. SceneContent.tsx** - Scene Composition
- Renders all 3D scene elements
- Maps over state to render dynamic objects
- Key pattern: State → Components → 3D Scene

**5. Ground.tsx** - Placement Surface
- Handles click-to-place interactions
- Raycasts to get 3D intersection point from event
- Visual feedback: changes color to green (#4ade80) when \`placingType\` is active
- Creates objects at intersection point with y-offset (+0.5)

**6. ObjectRenderer.tsx** - Object Rendering
- Renders individual 3D objects with interaction
- Different geometries per object type:
  - Camera: Blue box (#3b82f6)
  - Bin: Red wireframe box (#ef4444)
  - Obstacle: Orange box (#f59e0b)
  - Robot: Purple box (#8b5cf6)
- TransformControls appear when selected (translate mode)
- Updates store on both \`onChange\` and \`onMouseUp\` for reliable state sync

**7. ObjectLibrary.tsx** - Object Selection UI
- UI for selecting object types to place
- Visual feedback for active placement mode

**8. PropertiesPanel.tsx** - Object Properties Editor
- Edit selected object properties
- Position editing (x, y, z) with number inputs
- Rotation editing (x, y, z) with number inputs
- Real-time updates to store
- Delete functionality with confirmation dialog
- Object-specific properties section (placeholder for camera settings)`,
    },
    {
      id: 'state',
      title: 'State Management',
      icon: undefined,
      content: `### Zustand Store Structure

\`\`\`typescript
interface SceneStore {
  // State
  objects: SceneObject[];
  selectedObjectId: string | null;
  placingType: ObjectType | null;
  isPlacing: boolean; // Derived from placingType
  cameraMode: 'perspective' | 'orthographic';
  
  // Actions
  addObject: (object: SceneObject) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  setPlacingMode: (type: ObjectType | null) => void;
  setCameraMode: (mode: 'perspective' | 'orthographic') => void;
  setObjects: (objects: SceneObject[]) => void;
}
\`\`\`

**Key Behaviors:**
- \`addObject()\` automatically selects the new object and clears placing mode
- \`setPlacingMode()\` clears selection when entering placement mode
- \`isPlacing\` is automatically derived from \`placingType\`

### State Flow

**Unidirectional Flow:**
1. User Action → Store Update
2. Store Update → React Re-render
3. React Re-render → Visual Update

### Why Zustand?

- **Minimal Boilerplate**: No providers, no context
- **Performance**: Only subscribed components re-render
- **TypeScript**: Full type safety
- **Simple API**: Easy to understand and use`,
    },
    {
      id: 'rendering',
      title: '3D Rendering Pipeline',
      icon: undefined,
      content: `### How react-three-fiber Works

**Traditional Three.js (Imperative):**
\`\`\`javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer();
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
renderer.render(scene, camera);
\`\`\`

**react-three-fiber (Declarative):**
\`\`\`jsx
<Canvas>
  <mesh>
    <boxGeometry />
    <meshStandardMaterial />
  </mesh>
</Canvas>
\`\`\`

### Rendering Flow

React Component Tree → JSX Elements → react-three-fiber converts to Three.js objects → Three.js Scene Graph → WebGL Renderer → GPU Drawing → Screen Display

### Scene Graph Structure

- Scene (root)
  - AmbientLight
  - DirectionalLight
  - Ground (Mesh)
  - ObjectRenderer[] (Mesh)
    - TransformControls (when selected)

**Key:** R3F automatically manages scene, camera, renderer, and render loop.`,
    },
    {
      id: 'interactions',
      title: 'User Interaction Flow',
      icon: undefined,
      content: `### Object Placement Flow

1. User clicks object type → \`setPlacingMode(type)\` called
2. Store updates: \`placingType\` set, \`isPlacing\` becomes true, selection cleared
3. Ground component reads state → changes color to green (#4ade80)
4. User clicks ground → Raycaster provides 3D intersection point
5. Object created with \`createId()\` utility and position from point
6. \`addObject(newObject)\` called → Store updates:
   - Object added to array
   - \`selectedObjectId\` set to new object's id
   - \`placingType\` cleared
   - \`isPlacing\` becomes false
7. React re-renders SceneContent → ObjectRenderer created → Object appears
8. TransformControls attached (object auto-selected)

### Object Selection Flow

1. User clicks object mesh
2. \`selectObject()\` called
3. Store updates: \`selectedObjectId\`
4. TransformControls appear
5. PropertiesPanel updates with object data

### Transform Manipulation Flow

1. User drags TransformControls gizmo
2. \`onChange\` fires continuously during drag
3. \`onMouseUp\` fires when drag ends (ensures final state saved)
4. \`handleTransformChange()\` extracts position/rotation/scale from mesh ref
5. \`updateObject(id, updates)\` called
6. Store updates object in array
7. React re-renders ObjectRenderer → Visual update

**Key Pattern:** All interactions flow through the store, ensuring predictable state management. Both \`onChange\` and \`onMouseUp\` handlers ensure state sync reliability.`,
    },
    {
      id: 'dataflow',
      title: 'Data Flow',
      icon: undefined,
      content: `### Unidirectional Data Flow

**Pattern:** User UI → Zustand Store → React Components → 3D Scene

### Example: Adding an Object

1. **User Action:** ObjectLibrary → onClick → \`setPlacingMode('camera')\`
2. **Store Update:** \`placingType: null → 'camera'\`
3. **UI Update:** Ground component reads state → changes color
4. **User Action:** Ground → onClick → \`handleGroundClick()\`
5. **Object Creation:** Creates SceneObject with ID, position, etc.
6. **Store Update:** \`addObject(newObject)\` → objects array updated
7. **Component Update:** SceneContent reads objects → maps to ObjectRenderer
8. **Render:** New mesh appears in 3D scene

**Benefits:**
- Predictable state updates
- Easy to debug (single source of truth)
- Clear data flow direction
- No circular dependencies`,
    },
    {
      id: 'decisions',
      title: 'Key Design Decisions',
      icon: undefined,
      content: `### 1. Why react-three-fiber?

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

- **Application State**: User actions, object list
- **Transient State**: Animations, transforms (no re-renders)

### 3. Why Component-Based Architecture?

- **Single Responsibility**: Each component does one thing
- **Reusability**: Components can be composed
- **Testability**: Easy to test isolated components
- **Maintainability**: Clear structure, easy to understand

### 4. Why Zustand over Redux?

- Less boilerplate (no actions, reducers)
- Simpler API
- Better TypeScript support
- Smaller bundle size

### 5. Utility Functions

**transformUtils.ts:**
- \`createId()\`: Generates unique IDs using timestamp + random string
- \`createVector3()\`: Creates Vector3 objects
- \`vector3ToArray()\`: Converts Vector3 to [x, y, z] array
- \`arrayToVector3()\`: Converts array to Vector3

**configUtils.ts:**
- \`exportScene()\`: Converts objects array to JSON config with version and metadata
- \`importScene()\`: Parses JSON config to objects array
- \`downloadScene()\`: Downloads scene as JSON file (used by Toolbar)
- \`loadSceneFromFile()\`: Loads scene from file via FileReader (used by Toolbar)

**Why Utilities?**
- DRY principle: Don't repeat code
- Testability: Test logic separately
- Reusability: Use across components`,
    },
  ], []);

  // Auto-select first section on mount
  useEffect(() => {
    if (!activeSection && sections.length > 0) {
      setActiveSection(sections[0].id);
    }
  }, [activeSection, sections, setActiveSection]);

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-semibold mb-4 text-white">
            Architecture Documentation
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive guide to understanding how Vision Lab works. 
            Built with modularity, clarity, and professional polish.
          </p>
        </header>

        {/* Quick Reference Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ArchitectureCard title="Tech Stack">
            <ul className="space-y-1 text-sm">
              <li>React 18 + TypeScript</li>
              <li>react-three-fiber</li>
              <li>Zustand</li>
              <li>Three.js</li>
            </ul>
          </ArchitectureCard>
          <ArchitectureCard title="Patterns">
            <ul className="space-y-1 text-sm">
              <li>Modular Components</li>
              <li>Two-Tiered State</li>
              <li>Component Composition</li>
              <li>Unidirectional Flow</li>
            </ul>
          </ArchitectureCard>
          <ArchitectureCard title="Principles">
            <ul className="space-y-1 text-sm">
              <li>Single Responsibility</li>
              <li>DRY (Don't Repeat)</li>
              <li>SOLID Principles</li>
              <li>Professional Polish</li>
            </ul>
          </ArchitectureCard>
          <ArchitectureCard title="Performance">
            <ul className="space-y-1 text-sm">
              <li>Selective Re-renders</li>
              <li>60fps Rendering</li>
              <li>Optimized Updates</li>
              <li>Memoization</li>
            </ul>
          </ArchitectureCard>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation */}
          <aside className="lg:col-span-1">
            <ArchitectureNav
              sections={sections}
              activeSection={activeSection}
              onSectionClick={(id) => {
                setActiveSection(id === activeSection ? null : id);
              }}
            />
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 min-h-[600px]">
              {currentSection ? (
                <ArchitectureSection
                  id={currentSection.id}
                  title={currentSection.title}
                  isActive={!!activeSection}
                >
                  {currentSection.content}
                </ArchitectureSection>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg">
                    Select a section from the sidebar to explore the architecture
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
