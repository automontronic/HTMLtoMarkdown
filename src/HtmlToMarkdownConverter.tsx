import React, { useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TurndownService from 'turndown';
import { marked } from 'marked';

function HtmlToMarkdownConverter() {
  const [html, setHtml] = useState('<p>Hello, world!</p>');
  const [markdown, setMarkdown] = useState('');
  const [activeTab, setActiveTab] = useState('markdown');
  const [previewHtml, setPreviewHtml] = useState('');

  const convertHtmlToMarkdown = useCallback(() => {
    const turndownService = new TurndownService();
    setMarkdown(turndownService.turndown(html));
  }, [html]);

  const convertMarkdownToHtml = useCallback(() => {
    setPreviewHtml(marked(markdown));
  }, [markdown]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'preview') {
      convertMarkdownToHtml(); // Convert Markdown to HTML when clicking Preview
    }
  };

  // Quill modules configuration
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      
      [{ 'indent': '-1' }, { 'indent': '+1' }],         
      [{ 'direction': 'rtl' }],                         
      [{ 'size': ['small', false, 'large', 'huge'] }],  
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],         
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean']                                         
    ],
  };

  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'header',
    'list', 'bullet',
    'script',
    'indent',
    'direction',
    'size',
    'color', 'background',
    'font',
    'align',
    'link',
    'image',
    'video'
  ];

  return (
    <div className="flex flex-col">
      <h1 className="mb-4 text-center text-4xl font-bold font-mono">
          HTML to Markdown Convertor
      </h1>
      {/* Rich Text Editor */}
      <div className="mb-4">
        <label htmlFor="htmlInput" className="block text-gray-700 text-sm font-bold mb-2 font-mono">
          HTML Editor
        </label>
        <ReactQuill
          id="htmlInput"
          
          value={html}
          onChange={setHtml}
          modules={modules}
          formats={formats}
        />
      </div>

      {/* Convert Button */}
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline  font-mono"
          type="button"
          onClick={convertHtmlToMarkdown}
        >
          Convert
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 font-mono ${activeTab === 'markdown' ? 'border-blue-500 active text-blue-600' : 'text-gray-500'}`}
              onClick={() => handleTabClick('markdown')}
            >
              Markdown
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 font-mono ${activeTab === 'preview' ? 'border-blue-500 active text-blue-600' : 'text-gray-500'}`}
              onClick={() => handleTabClick('preview')}
            >
              Preview
            </button>
          </li>
        </ul>
      </div>

      {/* Markdown Preview */}
      <div>
        {activeTab === 'markdown' && (
          <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-mono">
                    Markdown
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500">
                    {markdown}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'preview' && (
          <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-mono">
                    Preview
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500">
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default HtmlToMarkdownConverter;
