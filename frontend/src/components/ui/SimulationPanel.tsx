/**
 * SimulationPanel - Simulation control interface
 * Following design principles: Single responsibility, user-focused, professional polish
 * 
 * Responsibility: Control simulation playback and speed
 * Clear visual feedback, intuitive controls, Apple-grade UX
 */
import { useSceneStore } from '../../stores/sceneStore';
import { Button } from './Button';
import { Card } from './Card';
import { filterRobots } from '../../utils/objectQueryUtils';

export function SimulationPanel() {
  const simulation = useSceneStore((state) => state.simulation);
  const paths = useSceneStore((state) => state.paths);
  const objects = useSceneStore((state) => state.objects);
  const startSimulation = useSceneStore((state) => state.startSimulation);
  const pauseSimulation = useSceneStore((state) => state.pauseSimulation);
  const stopSimulation = useSceneStore((state) => state.stopSimulation);
  const setSimulationSpeed = useSceneStore((state) => state.setSimulationSpeed);

  const robots = filterRobots(objects);
  const robotsWithPaths = robots.filter((r) => r.properties.pathId);

  // Find which path is assigned to a robot
  const assignedPath = robotsWithPaths.length > 0
    ? paths.find((p) => p.id === robotsWithPaths[0].properties.pathId)
    : null;

  const canStart = robotsWithPaths.length > 0 && simulation.state === 'idle';
  const canPause = simulation.state === 'playing';
  const canResume = simulation.state === 'paused';
  const canStop = simulation.state !== 'idle';

  const handleStart = () => {
    if (assignedPath) {
      startSimulation(assignedPath.id);
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(e.target.value);
    setSimulationSpeed(speed);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-white mb-1">Simulation</h2>
        <p className="text-xs text-gray-500 font-medium">
          {simulation.state === 'idle'
            ? 'Ready to simulate'
            : simulation.state === 'playing'
            ? 'Running...'
            : 'Paused'}
        </p>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Robots with paths:</span>
            <span className="text-sm font-medium text-white">
              {robotsWithPaths.length}
            </span>
          </div>
          {simulation.state !== 'idle' && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Progress:</span>
              <span className="text-sm font-medium text-white">
                {Math.round(simulation.progress * 100)}%
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Controls */}
      <div className="space-y-4">
        {/* Playback Controls */}
        <Card>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Playback
          </h3>
          <div className="space-y-2">
            {(canStart || canResume) && (
              <Button
                variant="primary"
                size="md"
                onClick={canStart ? handleStart : pauseSimulation}
                disabled={!canStart && !canResume}
                className="w-full"
                aria-label={canStart ? 'Start robot simulation' : 'Resume robot simulation'}
              >
                {canStart ? '▶ Start Simulation' : '▶ Resume'}
              </Button>
            )}
            {canPause && (
              <Button
                variant="secondary"
                size="md"
                onClick={pauseSimulation}
                className="w-full"
                aria-label="Pause simulation"
              >
                ⏸ Pause
              </Button>
            )}
            {canStop && (
              <Button
                variant="danger"
                size="md"
                onClick={stopSimulation}
                className="w-full"
                aria-label="Stop simulation and reset"
              >
                ⏹ Stop
              </Button>
            )}
          </div>
        </Card>

        {/* Speed Control */}
        <Card>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Speed
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Slower</span>
              <span className="font-medium text-white">
                {simulation.speed.toFixed(1)}x
              </span>
              <span>Faster</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={simulation.speed}
              onChange={handleSpeedChange}
              aria-label={`Simulation speed: ${simulation.speed.toFixed(1)}x`}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.1x</span>
              <span>5x</span>
            </div>
          </div>
        </Card>

        {/* Help Text */}
        {robotsWithPaths.length === 0 && (
          <div className="mt-6 p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg">
            <p className="text-xs font-medium text-blue-400 mb-1">
              No Robot Paths
            </p>
            <p className="text-xs text-gray-500">
              Create a path in the Paths tab and assign it to a robot to start
              simulation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

