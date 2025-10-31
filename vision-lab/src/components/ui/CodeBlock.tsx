/**
 * CodeBlock - Reusable code display component
 * Following design principles: Single responsibility, professional polish
 */
interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className = '' }: CodeBlockProps) {
  return (
    <div className={`bg-gray-900 rounded-lg p-4 overflow-x-auto ${className}`}>
      {language && (
        <div className="text-xs text-gray-500 mb-2 font-mono">{language}</div>
      )}
      <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap break-words">
        <code>{code}</code>
      </pre>
    </div>
  );
}

