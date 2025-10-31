/**
 * PropertiesPanel - Professional properties editor
 * Following design principles: Single responsibility, user-focused, enterprise-grade forms
 */
import { useSceneStore } from '../../stores/sceneStore';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';

export function PropertiesPanel() {
  const selectedObjectId = useSceneStore((state) => state.selectedObjectId);
  const objects = useSceneStore((state) => state.objects);
  const updateObject = useSceneStore((state) => state.updateObject);
  const removeObject = useSceneStore((state) => state.removeObject);

  const selectedObject = objects.find((obj) => obj.id === selectedObjectId);

  if (!selectedObject) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-300 mb-1.5">
            No Selection
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Select an object in the scene to view and edit properties
          </p>
        </div>
      </div>
    );
  }

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0;
    updateObject(selectedObject.id, {
      position: {
        ...selectedObject.position,
        [axis]: numValue,
      },
    });
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0;
    updateObject(selectedObject.id, {
      rotation: {
        ...selectedObject.rotation,
        [axis]: numValue,
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ${selectedObject.type}?`)) {
      removeObject(selectedObject.id);
    }
  };

  const objectTypeColors = {
    camera: { bg: 'bg-blue-600/10', border: 'border-blue-600/30', text: 'text-blue-400' },
    bin: { bg: 'bg-red-600/10', border: 'border-red-600/30', text: 'text-red-400' },
    obstacle: { bg: 'bg-orange-600/10', border: 'border-orange-600/30', text: 'text-orange-400' },
    robot: { bg: 'bg-purple-600/10', border: 'border-purple-600/30', text: 'text-purple-400' },
    gripper: { bg: 'bg-pink-600/10', border: 'border-pink-600/30', text: 'text-pink-400' },
  }[selectedObject.type];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className={`px-4 py-3 rounded-lg border ${objectTypeColors.bg} ${objectTypeColors.border} mb-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold capitalize text-white">
                {selectedObject.type}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Object Properties</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${objectTypeColors.text.replace('text-', 'bg-')}`} />
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={handleDelete} className="w-full">
          Delete Object
        </Button>
      </div>

      <div className="space-y-5">
        <Card>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Position
          </h3>
          <div className="space-y-3">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <Input
                key={axis}
                label={axis.toUpperCase()}
                type="number"
                value={selectedObject.position[axis].toFixed(2)}
                onChange={(e) => handlePositionChange(axis, e.target.value)}
                step="0.1"
              />
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Rotation
          </h3>
          <div className="space-y-3">
            {(['x', 'y', 'z'] as const).map((axis) => (
              <Input
                key={axis}
                label={axis.toUpperCase()}
                type="number"
                value={selectedObject.rotation[axis].toFixed(2)}
                onChange={(e) => handleRotationChange(axis, e.target.value)}
                step="0.1"
              />
            ))}
          </div>
        </Card>

        {selectedObject.type === 'camera' && (
          <Card>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
              Camera Settings
            </h3>
            <p className="text-xs text-gray-500">
              Advanced configuration available in future release
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
