/**
 * ObjectLibrary - Professional sidebar component for object selection
 * Following design principles: Single responsibility, user-focused, professional polish
 */
import { useSceneStore } from '../../stores/sceneStore';
import type { ObjectType } from '../../types';

const OBJECT_TYPES: { 
  type: ObjectType; 
  label: string; 
  description: string; 
  color: string;
  borderColor: string;
}[] = [
  { 
    type: 'camera', 
    label: 'Camera', 
    description: 'Vision sensor', 
    color: 'bg-blue-600/10',
    borderColor: 'border-blue-600/30'
  },
  { 
    type: 'bin', 
    label: 'Bin', 
    description: 'Container', 
    color: 'bg-red-600/10',
    borderColor: 'border-red-600/30'
  },
  { 
    type: 'obstacle', 
    label: 'Obstacle', 
    description: 'Barrier', 
    color: 'bg-orange-600/10',
    borderColor: 'border-orange-600/30'
  },
  { 
    type: 'robot', 
    label: 'Robot', 
    description: 'Manipulator', 
    color: 'bg-purple-600/10',
    borderColor: 'border-purple-600/30'
  },
  { 
    type: 'gripper', 
    label: 'Gripper', 
    description: 'End effector', 
    color: 'bg-pink-600/10',
    borderColor: 'border-pink-600/30'
  },
];

export function ObjectLibrary() {
  const placingType = useSceneStore((state) => state.placingType);
  const setPlacingMode = useSceneStore((state) => state.setPlacingMode);
  const objects = useSceneStore((state) => state.objects);

  const handleObjectClick = (type: ObjectType) => {
    setPlacingMode(type === placingType ? null : type);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-white mb-1">Object Library</h2>
        <p className="text-xs text-gray-500 font-medium">
          {objects.length === 0
            ? 'No objects in scene'
            : `${objects.length} object${objects.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="space-y-2">
        {OBJECT_TYPES.map(({ type, label, description, color }) => {
          const isActive = placingType === type;
          return (
            <button
              key={type}
              onClick={() => handleObjectClick(type)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                isActive
                  ? `border-blue-600 ${color} ring-1 ring-blue-600/20`
                  : `border-gray-700 hover:border-gray-600 hover:bg-gray-800/50`
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm text-white mb-0.5">{label}</div>
                  <div className="text-xs text-gray-500">{description}</div>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {placingType && (
        <div className="mt-6 p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
          <p className="text-xs font-medium text-blue-400 mb-1">
            Placement Mode Active
          </p>
          <p className="text-xs text-gray-500">
            Click on the ground to place a {placingType}
          </p>
        </div>
      )}

      {objects.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
            Scene Objects
          </p>
          <div className="space-y-1.5">
            {objects.map((obj) => (
              <div
                key={obj.id}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded text-xs text-gray-400"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                <span className="capitalize font-medium">{obj.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
