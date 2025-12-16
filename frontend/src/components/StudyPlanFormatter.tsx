import React from 'react';

interface StudyPlanFormatterProps {
  content: string;
}

export default function StudyPlanFormatter({ content }: StudyPlanFormatterProps) {
  const formatContent = (text: string) => {
    // Clean up asterisks and quotes
    const cleanText = text
      .replace(/\*\*"([^"]+)"\*\*/g, '$1') // Remove **"text"**
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove **text**
      .replace(/\*([^*]+)\*/g, '$1') // Remove *text*
      .replace(/""/g, '"'); // Fix double quotes
    
    const lines = cleanText.split('\n');
    const formatted: React.ReactElement[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        formatted.push(<div key={key++} className="h-4"></div>);
        continue;
      }

      // Main headings (##)
      if (line.startsWith('## ')) {
        formatted.push(
          <h2 key={key++} className="text-2xl font-bold text-gray-800 mt-8 mb-4 pb-2 border-b-2 border-indigo-200">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // Sub headings (###)
      else if (line.startsWith('### ')) {
        formatted.push(
          <h3 key={key++} className="text-xl font-semibold text-gray-700 mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Smaller headings (####)
      else if (line.startsWith('#### ')) {
        formatted.push(
          <h4 key={key++} className="text-lg font-medium text-gray-600 mt-4 mb-2">
            {line.replace('#### ', '')}
          </h4>
        );
      }
      // Bullet points
      else if (line.startsWith('* ') || line.startsWith('- ')) {
        formatted.push(
          <div key={key++} className="flex items-start mb-2 ml-4">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-700">{line.replace(/^[*-] /, '')}</span>
          </div>
        );
      }
      // Numbered lists
      else if (/^\d+\./.test(line)) {
        const match = line.match(/^(\d+)\.\s*(.+)/);
        if (match) {
          formatted.push(
            <div key={key++} className="flex items-start mb-2 ml-4">
              <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                {match[1]}
              </span>
              <span className="text-gray-700">{match[2]}</span>
            </div>
          );
        }
      }
      // Book titles and important text (now cleaned)
      else if (line.includes('"') && line.length > 20) {
        formatted.push(
          <p key={key++} className="text-gray-700 mb-3 leading-relaxed font-medium">
            {line}
          </p>
        );
      }
      // Horizontal rule
      else if (line.startsWith('---')) {
        formatted.push(<hr key={key++} className="my-6 border-gray-300" />);
      }
      // Regular paragraphs
      else {
        formatted.push(
          <p key={key++} className="text-gray-700 mb-3 leading-relaxed">
            {line}
          </p>
        );
      }
    }

    return formatted;
  };

  return (
    <div className="prose max-w-none">
      {formatContent(content)}
    </div>
  );
}