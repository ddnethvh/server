import React, { useState, useEffect } from 'react';
import { 
  BiBold, 
  BiItalic, 
  BiCode, 
  BiLink, 
  BiListUl, 
  BiListOl,
  BiHeading,
  BiCodeBlock,
  BiSave
} from 'react-icons/bi';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Editor.css';

const MarkdownRenderer = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkBreaks, remarkGfm]}
    components={{
      p: ({children}) => {
        // If children is undefined or null, return empty paragraph
        if (!children) return <p></p>;
        
        // Convert to array if it's not already
        const childArray = Array.isArray(children) ? children : [children];
        
        // Get the text content
        const textContent = childArray
          .map(child => typeof child === 'string' ? child : '')
          .join('');
        
        // Split by newlines and filter out empty strings that aren't intentional
        const lines = textContent.split('\n');
        
        return (
          <p style={{whiteSpace: 'pre-wrap'}}>
            {lines.map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </p>
        );
      },
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : '';
        
        // Handle inline code
        if (inline) {
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }

        // Handle code blocks with syntax highlighting
        return (
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={language}
            PreTag="div"
            customStyle={{
              margin: '1em 0',
              padding: '1rem',
              backgroundColor: 'rgba(10, 10, 10, 0.9)',
              border: '1px solid rgba(0, 255, 157, 0.2)',
              borderRadius: '4px',
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      }
    }}
  >
    {content}
  </ReactMarkdown>
);

const Editor = ({ content, onChange, onSave }) => {
  const [text, setText] = useState(content);
  const [preview, setPreview] = useState(true);

  useEffect(() => {
    setText(content);
  }, [content]);

  const insertText = (before, after = '') => {
    const textarea = document.querySelector('.editor-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setText(newText);
    onChange(newText);
  };

  const handleToolbarAction = (action) => {
    switch (action) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'code':
        insertText('`', '`');
        break;
      case 'link':
        insertText('[', '](url)');
        break;
      case 'ul':
        insertText('- ');
        break;
      case 'ol':
        insertText('1. ');
        break;
      case 'heading':
        insertText('## ');
        break;
      case 'codeblock':
        insertText('```\n', '\n```');
        break;
      default:
        break;
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-content">
        <div className={`editor-pane ${!preview ? 'full-width' : ''}`}>
          <textarea
            className="editor-textarea"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Write your content here..."
          />
        </div>
        {preview && (
          <div className="preview-pane">
            <MarkdownRenderer content={text} />
          </div>
        )}
      </div>
      <div className="editor-toolbar">
        <div className="toolbar-actions">
          <button onClick={() => handleToolbarAction('bold')} title="Bold">
            <BiBold />
          </button>
          <button onClick={() => handleToolbarAction('italic')} title="Italic">
            <BiItalic />
          </button>
          <button onClick={() => handleToolbarAction('code')} title="Inline Code">
            <BiCode />
          </button>
          <button onClick={() => handleToolbarAction('link')} title="Link">
            <BiLink />
          </button>
          <button onClick={() => handleToolbarAction('ul')} title="Unordered List">
            <BiListUl />
          </button>
          <button onClick={() => handleToolbarAction('ol')} title="Ordered List">
            <BiListOl />
          </button>
          <button onClick={() => handleToolbarAction('heading')} title="Heading">
            <BiHeading />
          </button>
          <button onClick={() => handleToolbarAction('codeblock')} title="Code Block">
            <BiCodeBlock />
          </button>
        </div>
        <div className="toolbar-controls">
          <button 
            className={`preview-toggle ${preview ? 'active' : ''}`}
            onClick={() => setPreview(!preview)}
          >
            Preview
          </button>
          <button 
            className="save-button" 
            onClick={onSave}
            title="Save Changes"
          >
            <BiSave />
          </button>
        </div>
      </div>
    </div>
  );
};

export { MarkdownRenderer };
export default Editor; 