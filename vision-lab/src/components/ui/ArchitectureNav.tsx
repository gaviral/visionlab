/**
 * ArchitectureNav - Navigation component for architecture sections
 * Following design principles: Single responsibility, polished interactions
 */
interface Section {
  id: string;
  title: string;
}

interface ArchitectureNavProps {
  sections: Section[];
  activeSection: string | null;
  onSectionClick: (id: string) => void;
}

export function ArchitectureNav({
  sections,
  activeSection,
  onSectionClick,
}: ArchitectureNavProps) {
  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sticky top-4 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-white">Sections</h2>
      <ul className="space-y-1">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => onSectionClick(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

