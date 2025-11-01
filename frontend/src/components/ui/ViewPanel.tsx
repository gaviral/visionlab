/**
 * ViewPanel - Visual display controls
 * Following design principles: Single responsibility, user-focused, clear toggles
 * 
 * Responsibility: Toggle visibility of various scene visualizations (frustums, paths, collisions)
 */
import { useSceneStore } from '../../stores/sceneStore';
import { Card } from './Card';

export function ViewPanel() {
  const viewSettings = useSceneStore((state) => state.viewSettings);
  const toggleFrustums = useSceneStore((state) => state.toggleFrustums);
  const togglePaths = useSceneStore((state) => state.togglePaths);
  const toggleCollisions = useSceneStore((state) => state.toggleCollisions);

  /**
   * ToggleButton component - Reusable toggle with visual feedback
   * Following design principles: DRY, reusable, composable
   */
  interface ToggleButtonProps {
    label: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
    icon: string;
  }

  function ToggleButton({ label, description, enabled, onToggle, icon }: ToggleButtonProps) {
    return (
      <button
        onClick={onToggle}
        aria-label={`${enabled ? 'Hide' : 'Show'} ${label}`}
        aria-pressed={enabled}
        className={`
          w-full text-left px-4 py-3 rounded-lg border transition-all duration-200
          ${
            enabled
              ? 'border-blue-600 bg-blue-600/10 ring-1 ring-blue-600/20'
              : 'border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
          }
        `}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <span className="text-xl">{icon}</span>

          {/* Label + Description */}
          <div className="flex-1">
            <p className={`text-sm font-medium ${enabled ? 'text-blue-400' : 'text-gray-300'}`}>
              {label}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>

          {/* Status Indicator */}
          <div
            className={`
              w-10 h-5 rounded-full transition-all duration-200 relative
              ${enabled ? 'bg-blue-600' : 'bg-gray-700'}
            `}
          >
            <div
              className={`
                absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200
                ${enabled ? 'left-5' : 'left-0.5'}
              `}
            />
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white mb-1">Display Settings</h2>
        <p className="text-xs text-gray-500">Control what is visible in the 3D viewport</p>
      </div>

      <Card>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
          Visualizations
        </h3>
        <div className="space-y-3">
          <ToggleButton
            label="Camera Frustums"
            description="Show camera field of view (FOV) cones"
            enabled={viewSettings.showFrustums}
            onToggle={toggleFrustums}
            icon="◇"
          />
          <ToggleButton
            label="Path Lines"
            description="Show robot movement paths and waypoints"
            enabled={viewSettings.showPaths}
            onToggle={togglePaths}
            icon="―"
          />
          <ToggleButton
            label="Collision Indicators"
            description="Highlight objects with collisions in red"
            enabled={viewSettings.showCollisions}
            onToggle={toggleCollisions}
            icon="⬢"
          />
        </div>
      </Card>

      {/* Visual Feedback Status */}
      <Card className="bg-gray-800/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <p className="text-xs text-gray-400">
            {[viewSettings.showFrustums && 'Frustums', viewSettings.showPaths && 'Paths', viewSettings.showCollisions && 'Collisions']
              .filter(Boolean)
              .join(' • ') || 'All visualizations hidden'}
          </p>
        </div>
      </Card>
    </div>
  );
}

