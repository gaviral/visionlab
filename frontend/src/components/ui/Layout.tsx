/**
 * Layout component - Professional layout system
 * Following design principles: Single responsibility, composition, enterprise-grade visual hierarchy
 */
import { ReactNode } from 'react';
import { ObjectLibrary } from './ObjectLibrary';
import { PropertiesPanel } from './PropertiesPanel';
import { PathPanel } from './PathPanel';
import { SimulationPanel } from './SimulationPanel';
import { TabbedPanel } from './TabbedPanel';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img 
            src="/favicon.svg" 
            alt="Vision Lab" 
            className="w-7 h-7 rounded"
          />
          <h1 className="text-base font-semibold text-white">
            Vision Lab
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-72 bg-gray-800 border-r border-gray-700 overflow-y-auto shadow-xl scrollbar-thin flex-shrink-0">
          <ObjectLibrary />
        </aside>

        {/* 3D Viewport */}
        <main className="flex-1 relative overflow-hidden">{children}</main>

        {/* Right Tabbed Panel */}
        <aside className="w-72 bg-gray-800 border-l border-gray-700 shadow-xl flex-shrink-0">
          <TabbedPanel
            tabs={[
              {
                id: 'properties',
                label: 'Properties',
                content: <PropertiesPanel />,
              },
              {
                id: 'paths',
                label: 'Paths',
                content: <PathPanel />,
              },
              {
                id: 'simulation',
                label: 'Simulation',
                content: <SimulationPanel />,
              },
            ]}
            defaultTab="properties"
          />
        </aside>
      </div>
    </div>
  );
}
