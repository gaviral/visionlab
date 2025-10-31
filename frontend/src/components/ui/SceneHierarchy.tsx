/**
 * SceneHierarchy - Unity-style scene hierarchy panel
 * Following design principles: Single responsibility, user-focused, professional polish
 * 
 * Responsibility: Display scene objects in hierarchical tree view
 * Inspired by: Unity Game Engine hierarchy window
 * Features: Parent-child relationships, sorting, clickable selection
 */
/* eslint-disable max-lines-per-function */
// Exception: UI panel with tree rendering - layout code justifies length
import { useState } from 'react';
import { useSceneStore } from '../../stores/sceneStore';
import type { SceneObject, ObjectType } from '../../types';

type SortMode = 'hierarchy' | 'type' | 'name';

/**
 * Get icon for object type
 * Following design principles: Visual clarity, consistency
 */
function getObjectIcon(type: ObjectType): string {
  const icons: Record<ObjectType, string> = {
    camera: '📷',
    bin: '📦',
    obstacle: '🚧',
    robot: '🤖',
    gripper: '🦾',
  };
  return icons[type];
}

/**
 * Get children for parent object (robot → gripper, robot → camera with eye-in-hand)
 * Following design principles: Single responsibility, type safety
 */
function getObjectChildren(parent: SceneObject, allObjects: SceneObject[]): SceneObject[] {
  const children: SceneObject[] = [];
  
  if (parent.type === 'robot') {
    // Find gripper attached to this robot
    const gripper = allObjects.find(
      (obj) => obj.type === 'gripper' && obj.properties.parentId === parent.id
    );
    if (gripper) {
      children.push(gripper);
    }
    
    // Find eye-in-hand cameras attached to this robot
    const eyeInHandCameras = allObjects.filter(
      (obj) =>
        obj.type === 'camera' &&
        obj.properties.cameraMode === 'eye-in-hand' &&
        obj.properties.parentId === parent.id
    );
    children.push(...eyeInHandCameras);
  }
  
  return children;
}

/**
 * Get root objects (objects without parents)
 * Following design principles: Pure function, clear logic
 */
function getRootObjects(objects: SceneObject[]): SceneObject[] {
  return objects.filter((obj) => !obj.properties.parentId);
}

/**
 * TreeNode component - Single object in hierarchy
 * Following design principles: Reusable, composable, single responsibility
 */
interface TreeNodeProps {
  object: SceneObject;
  allObjects: SceneObject[];
  selectedId: string | null;
  level: number;
  onSelect: (id: string) => void;
}

function TreeNode({ object, allObjects, selectedId, level, onSelect }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const children = getObjectChildren(object, allObjects);
  const hasChildren = children.length > 0;
  const isSelected = object.id === selectedId;

  return (
    <div>
      {/* Object row */}
      <button
        onClick={() => onSelect(object.id)}
        aria-label={`Select ${object.type} ${object.id.slice(0, 8)}`}
        aria-selected={isSelected}
        className={`
          w-full text-left px-3 py-2 flex items-center gap-2 transition-all duration-150
          ${isSelected ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:bg-gray-700/50'}
        `}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
      >
        {/* Expand/collapse arrow */}
        {hasChildren && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="w-4 h-4 flex items-center justify-center cursor-pointer text-gray-500 hover:text-gray-300"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        {!hasChildren && <span className="w-4" />}

        {/* Icon + Name */}
        <span className="text-sm">{getObjectIcon(object.type)}</span>
        <span className="text-xs font-medium flex-1 truncate">
          {object.type} {object.id.slice(0, 8)}
        </span>

        {/* Type badge */}
        <span className="text-xs text-gray-500 uppercase">{object.type}</span>
      </button>

      {/* Children (recursive) */}
      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              object={child}
              allObjects={allObjects}
              selectedId={selectedId}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * SceneHierarchy panel - Main component
 * Following design principles: Composition, user experience first
 */
export function SceneHierarchy() {
  const objects = useSceneStore((state) => state.objects);
  const selectedObjectId = useSceneStore((state) => state.selectedObjectId);
  const selectObject = useSceneStore((state) => state.selectObject);
  
  const [sortMode, setSortMode] = useState<SortMode>('hierarchy');

  const rootObjects = getRootObjects(objects);

  // Sort root objects based on mode
  const sortedRoots = [...rootObjects].sort((a, b) => {
    switch (sortMode) {
      case 'type':
        return a.type.localeCompare(b.type);
      case 'name':
        return a.id.localeCompare(b.id);
      case 'hierarchy':
      default:
        // Keep creation order for hierarchy mode
        return 0;
    }
  });

  const handleSelect = (id: string) => {
    selectObject(id === selectedObjectId ? null : id);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-white mb-3">Scene Hierarchy</h2>
        
        {/* Sort controls */}
        <div className="flex gap-1">
          {(['hierarchy', 'type', 'name'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              aria-label={`Sort by ${mode}`}
              aria-pressed={sortMode === mode}
              className={`
                px-2 py-1 text-xs rounded transition-all duration-150
                ${
                  sortMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
                }
              `}
            >
              {mode === 'hierarchy' ? '🌳' : mode === 'type' ? '📋' : '🔤'}
            </button>
          ))}
        </div>
      </div>

      {/* Hierarchy tree */}
      <div className="flex-1 overflow-y-auto">
        {objects.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500">No objects in scene</p>
            <p className="text-xs text-gray-600 mt-1">
              Add objects from Object Library
            </p>
          </div>
        ) : (
          <div className="py-2">
            {sortedRoots.map((obj) => (
              <TreeNode
                key={obj.id}
                object={obj}
                allObjects={objects}
                selectedId={selectedObjectId}
                level={0}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="p-3 border-t border-gray-700 bg-gray-800/50">
        <p className="text-xs text-gray-500">
          {objects.length} object{objects.length !== 1 ? 's' : ''} total
          {selectedObjectId && ' • 1 selected'}
        </p>
      </div>
    </div>
  );
}

