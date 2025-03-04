import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TurndownService from 'turndown';
import { marked } from 'marked';

function HtmlToMarkdownConverter() {
  const initialHtml = `
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <h6>Heading 6</h6>
    <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
    <ul>
      <li>List item one</li>
      <li>List item two</li>
    </ul>
    <ol>
      <li>First ordered item</li>
      <li>First ordered item</li>
    </ol>
    <a href="https://example.com">Link to example.com</a>

    <pre><code class="language-javascript">console.log("Hello, world!");</code></pre>
    <hr />
  `;

  const [html, setHtml] = useState(initialHtml);
  const [markdown, setMarkdown] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [previewHtml, setPreviewHtml] = useState('');
  const previewRef = useRef<HTMLIFrameElement>(null);

  const convertHtmlToMarkdown = useCallback(() => {
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });

    turndownService.addRule('list-item', {
      filter: 'li',
      replacement: (content, node) => {
        return '  * ' + content + '\n';
      }
    });

    turndownService.addRule('blockquote', {
      filter: 'blockquote',
      replacement: function (content) {
        return '> ' + content.replace(/\n+/g, '\n> ');
      }
    });

    const newMarkdown = turndownService.turndown(html);
    setMarkdown(newMarkdown);
    setActiveTab('markdown');
  }, [html]);

  const convertMarkdownToHtml = useCallback(() => {
    const htmlContent = marked(markdown);
    setPreviewHtml(htmlContent);
  
  }, [markdown]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'preview') {
      convertMarkdownToHtml();
    }
  };

  useEffect(() => {
    if (activeTab === 'preview' && previewRef.current) {
      const iframe = previewRef.current;
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDocument) {
        iframeDocument.body.innerHTML = previewHtml;
      }
    }
  }, [previewHtml, activeTab]);

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

      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline font-mono"
          type="button"
          onClick={convertHtmlToMarkdown}
        >
          Convert
        </button>
      </div>

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
                    <iframe
                      ref={previewRef}
                      title="HTML Preview"
                      style={{ width: '100%', height: '300px', border: 'none' }}
                    />
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
