/**
 * ArchitectureSection - Professional section component with robust markdown rendering
 * Following design principles: Single responsibility, progressive disclosure, professional formatting
 */
import { ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';

interface ArchitectureSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  isActive: boolean;
}

function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: ReactNode[] = [];
  let currentParagraph: string[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLanguage = '';
  let listItems: string[] = [];
  let inList = false;

  const processInlineMarkdown = (text: string): ReactNode => {
    if (!text) return '';
    
    const parts: ReactNode[] = [];
    let key = 0;

    // Process bold (**text**) and inline code (`code`) simultaneously
    // Simple regex that handles multiple occurrences
    const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match;
    let foundMatch = false;

    while ((match = pattern.exec(text)) !== null) {
      foundMatch = true;
      // Add text before match
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        if (beforeText) {
          parts.push(<span key={key++}>{beforeText}</span>);
        }
      }

      // Process match
      const matched = match[0];
      if (matched.startsWith('**') && matched.endsWith('**')) {
        parts.push(
          <strong key={key++} className="text-white font-semibold">
            {matched.slice(2, -2)}
          </strong>
        );
      } else if (matched.startsWith('`') && matched.endsWith('`')) {
        parts.push(
          <code
            key={key++}
            className="bg-gray-900 px-1.5 py-0.5 rounded text-sm font-mono text-blue-300"
          >
            {matched.slice(1, -1)}
          </code>
        );
      } else {
        parts.push(<span key={key++}>{matched}</span>);
      }

      lastIndex = pattern.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    }

    // If no markdown found, return plain text
    if (!foundMatch && parts.length === 0) {
      return text;
    }

    return <>{parts}</>;
  };

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const paragraph = currentParagraph.join(' ').trim();
      if (paragraph) {
        elements.push(
          <p key={elements.length} className="mb-4 leading-relaxed text-gray-300">
            {processInlineMarkdown(paragraph)}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={elements.length} className="mb-4 space-y-2 ml-6 list-disc">
          {listItems.map((item, i) => {
            const cleanItem = item.replace(/^[-*]\s+/, '');
            return (
              <li key={i} className="text-gray-300">
                {processInlineMarkdown(cleanItem)}
              </li>
            );
          })}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushCodeBlock = () => {
    if (codeContent.length > 0) {
      elements.push(
        <CodeBlock
          key={elements.length}
          code={codeContent.join('\n')}
          language={codeLanguage}
          className="mb-4"
        />
      );
      codeContent = [];
      codeLanguage = '';
      inCodeBlock = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushParagraph();
        flushList();
        inCodeBlock = true;
        const lang = trimmed.slice(3).trim();
        codeLanguage = lang || '';
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    // Headers
    if (trimmed.startsWith('###')) {
      flushParagraph();
      flushList();
      const headerText = trimmed.replace(/^###+\s*/, '');
      elements.push(
        <h4 key={elements.length} className="text-lg font-semibold mt-6 mb-3 text-white">
          {processInlineMarkdown(headerText)}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('##')) {
      flushParagraph();
      flushList();
      const headerText = trimmed.replace(/^##+\s*/, '');
      elements.push(
        <h3 key={elements.length} className="text-xl font-semibold mt-6 mb-4 text-white">
          {processInlineMarkdown(headerText)}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('#')) {
      flushParagraph();
      flushList();
      const headerText = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <h2 key={elements.length} className="text-2xl font-bold mt-8 mb-4 text-white">
          {processInlineMarkdown(headerText)}
        </h2>
      );
      return;
    }

    // Lists
    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      if (!inList) {
        inList = true;
      }
      listItems.push(trimmed);
      return;
    }

    // End of list
    if (inList && trimmed === '') {
      flushList();
      return;
    }

    // Regular paragraph
    if (trimmed === '') {
      flushParagraph();
    } else {
      currentParagraph.push(trimmed);
    }
  });

  flushParagraph();
  flushList();
  flushCodeBlock();

  return <div>{elements}</div>;
}

export function ArchitectureSection({
  id,
  title,
  children,
  isActive,
}: ArchitectureSectionProps) {
  const content = typeof children === 'string' ? children : String(children);

  return (
    <section
      id={id}
      className={`transition-all duration-300 ${
        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <h2 className="text-3xl font-bold mb-6 text-white">{title}</h2>
      <div className="prose prose-invert max-w-none">
        <MarkdownText text={content} />
      </div>
    </section>
  );
}
