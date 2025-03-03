import React from 'react';
import HtmlToMarkdownConverter from './HtmlToMarkdownConverter';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
      <div className="container mx-auto">
        <HtmlToMarkdownConverter />
      </div>
    </div>
  );
}

export default App;
