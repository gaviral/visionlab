/**
 * PathPanel - Path management interface
 * Following design principles: Single responsibility, user-focused, progressive disclosure
 * 
 * Responsibility: Create, edit, and assign paths to robots
 * Progressive disclosure: Show details only when needed
 */
/* eslint-disable max-lines-per-function */
// Exception: UI panel with multiple sections - layout code justifies length
import { useState } from 'react';
import { useSceneStore } from '../../stores/sceneStore';
import { Button } from './Button';
import { Card } from './Card';
import { filterRobots } from '../../utils/objectQueryUtils';
import type { RobotObject } from '../../types';

export function PathPanel() {
  const paths = useSceneStore((state) => state.paths);
  const objects = useSceneStore((state) => state.objects);
  const updateObject = useSceneStore((state) => state.updateObject);
  const createPath = useSceneStore((state) => state.createPath);
  const removePath = useSceneStore((state) => state.removePath);
  const addWaypoint = useSceneStore((state) => state.addWaypoint);
  const removeWaypoint = useSceneStore((state) => state.removeWaypoint);
  const updateWaypoint = useSceneStore((state) => state.updateWaypoint);
  const updatePath = useSceneStore((state) => state.updatePath);
  
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  const robots = filterRobots(objects);
  const selectedPath = paths.find((p) => p.id === selectedPathId);

  const handleCreatePath = () => {
    const pathId = createPath({ loop: false, speed: 1.0 });
    setSelectedPathId(pathId);
    
    // Add a default first waypoint at origin
    addWaypoint(pathId, { x: 0, y: 0.5, z: 0 });
  };

  const handleDeletePath = () => {
    if (!selectedPath) return;
    if (window.confirm(`Delete path with ${selectedPath.waypoints.length} waypoints?`)) {
      removePath(selectedPath.id);
      setSelectedPathId(null);
    }
  };

  const handleAddWaypoint = () => {
    if (!selectedPath) return;
    // Add waypoint 1 unit forward from last waypoint
    const lastWaypoint = selectedPath.waypoints[selectedPath.waypoints.length - 1];
    const position = lastWaypoint
      ? { x: lastWaypoint.position.x, y: lastWaypoint.position.y, z: lastWaypoint.position.z + 1 }
      : { x: 0, y: 0.5, z: 0 };
    addWaypoint(selectedPath.id, position);
  };

  const handleToggleLoop = () => {
    if (!selectedPath) return;
    updatePath(selectedPath.id, { loop: !selectedPath.loop });
  };

  const handleAssignPath = (robot: RobotObject, pathId: string) => {
    updateObject(robot.id, {
      properties: {
        ...robot.properties,
        pathId,
      },
    });
  };

  const handleUnassignPath = (robot: RobotObject) => {
    updateObject(robot.id, {
      properties: {
        ...robot.properties,
        pathId: null,
      },
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-white mb-1">Paths</h2>
        <p className="text-xs text-gray-500 font-medium">
          {paths.length === 0
            ? 'No paths created'
            : `${paths.length} path${paths.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Create Path Button */}
      <Button
        variant="primary"
        size="md"
        onClick={handleCreatePath}
        className="w-full mb-6"
        aria-label="Create new robot path"
      >
        + Create Path
      </Button>

      {/* Path List */}
      {paths.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Available Paths
          </h3>
          {paths.map((path) => {
            const isSelected = path.id === selectedPathId;
            const assignedRobots = robots.filter(
              (r) => r.properties.pathId === path.id
            );

            return (
              <Card
                key={path.id}
                onClick={() => setSelectedPathId(isSelected ? null : path.id)}
                className={`cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-600/5' : ''
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-white">
                        Path {path.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {path.waypoints.length} waypoint
                        {path.waypoints.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {path.loop ? '↻ Loop' : '→ Linear'}
                    </div>
                  </div>
                  {assignedRobots.length > 0 && (
                    <div className="text-xs text-blue-400 font-medium">
                      ✓ Assigned to {assignedRobots.length} robot
                      {assignedRobots.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Selected Path Details */}
      {selectedPath && (
        <>
          <Card className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
              Path Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Speed:</span>
                <span className="text-white font-medium">
                  {selectedPath.speed} units/s
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Mode:</span>
                <button
                  onClick={handleToggleLoop}
                  className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
                >
                  {selectedPath.loop ? '↻ Looping' : '→ Linear'} (click to toggle)
                </button>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Waypoints:</span>
                <span className="text-white font-medium">
                  {selectedPath.waypoints.length}
                </span>
              </div>
            </div>
          </Card>

          {/* Waypoint Management */}
          <Card className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
              Waypoints
            </h3>
            <div className="space-y-3 mb-4">
              {selectedPath.waypoints.map((waypoint, index) => (
                <div
                  key={waypoint.id}
                  className="p-3 bg-gray-700/30 rounded space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-white">
                      Waypoint {index + 1}
                    </p>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeWaypoint(selectedPath.id, waypoint.id)}
                      disabled={selectedPath.waypoints.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['x', 'y', 'z'] as const).map((axis) => (
                      <div key={axis}>
                        <label className="text-xs text-gray-400 uppercase block mb-1">
                          {axis}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={waypoint.position[axis].toFixed(2)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            updateWaypoint(selectedPath.id, waypoint.id, {
                              position: {
                                ...waypoint.position,
                                [axis]: value,
                              },
                            });
                          }}
                          className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleAddWaypoint}
              className="w-full"
            >
              + Add Waypoint
            </Button>
          </Card>

          {/* Path Actions */}
          <Button
            variant="danger"
            size="md"
            onClick={handleDeletePath}
            className="w-full mb-6"
          >
            Delete Path
          </Button>
        </>
      )}

      {/* Robot Assignment */}
      {robots.length > 0 && (
        <Card>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Assign to Robots
          </h3>
          <div className="space-y-2">
            {robots.map((robot) => {
              const hasPath = robot.properties.pathId !== null;
              const assignedPath = hasPath
                ? paths.find((p) => p.id === robot.properties.pathId)
                : null;

              return (
                <div
                  key={robot.id}
                  className="flex items-center justify-between p-2 bg-gray-700/30 rounded"
                >
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white">
                      Robot {robot.id.slice(0, 8)}
                    </p>
                    {hasPath && assignedPath && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Path: {assignedPath.id.slice(0, 8)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!hasPath && selectedPath && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAssignPath(robot, selectedPath.id)}
                      >
                        Assign
                      </Button>
                    )}
                    {hasPath && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUnassignPath(robot)}
                      >
                        Unassign
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Help Text */}
      {paths.length === 0 && (
        <div className="mt-6 p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
          <p className="text-xs font-medium text-blue-400 mb-1">No Paths Yet</p>
          <p className="text-xs text-gray-500">
            Create a path to define robot movement. Each path consists of
            waypoints (positions and orientations).
          </p>
        </div>
      )}

      {robots.length === 0 && paths.length > 0 && (
        <div className="mt-6 p-3 bg-orange-600/10 border border-orange-600/30 rounded-lg">
          <p className="text-xs font-medium text-orange-400 mb-1">
            No Robots in Scene
          </p>
          <p className="text-xs text-gray-500">
            Add a robot from the Object Library to assign paths.
          </p>
        </div>
      )}
    </div>
  );
}

