import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Undo,
  Redo,
  Code,
} from "lucide-react";

const TextEditor = ({ content, onChange, placeholder, compact = false }) => {
  const editorRef = useRef(null);
  const [isCodeView, setIsCodeView] = useState(false);

  useEffect(() => {
    if (
      editorRef.current &&
      !isCodeView &&
      editorRef.current.innerHTML !== content
    ) {
      editorRef.current.innerHTML = content;
    }
  }, [content, isCodeView]);

  const executeCommand = (command, value) => {
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = isCodeView
        ? editorRef.current.innerText
        : editorRef.current.innerHTML;
      onChange(newContent);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      executeCommand("insertImage", url);
    }
  };

  const ToolbarButton = ({ icon, command, value, onClick, active }) => (
    <button
      type="button"
      className={`p-2 rounded-lg transition-colors ${
        active ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"
      }`}
      onClick={onClick || (() => executeCommand(command, value))}
      onMouseDown={(e) => e.preventDefault()}
    >
      {icon}
    </button>
  );

  return (
    <div
      className={`${
        compact ? "" : "border border-gray-200 rounded-lg shadow-sm"
      } overflow-hidden bg-white`}
    >
      {/* Toolbar */}
      <div
        className={`border-b border-gray-200 ${
          compact ? "p-2" : "p-3"
        } bg-gray-50`}
      >
        <div
          className={`flex items-center space-x-1 flex-wrap ${
            compact ? "gap-1" : "gap-2"
          }`}
        >
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <ToolbarButton icon={<Undo size={16} />} command="undo" />
            <ToolbarButton icon={<Redo size={16} />} command="redo" />
          </div>

          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <select
              className={`text-sm border border-gray-200 rounded px-2 py-1 ${
                compact ? "text-xs" : ""
              }`}
              onChange={(e) => executeCommand("formatBlock", e.target.value)}
            >
              <option value="div">Normal</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <ToolbarButton icon={<Bold size={16} />} command="bold" />
            <ToolbarButton icon={<Italic size={16} />} command="italic" />
            <ToolbarButton icon={<Underline size={16} />} command="underline" />
          </div>

          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <ToolbarButton
              icon={<AlignLeft size={16} />}
              command="justifyLeft"
            />
            <ToolbarButton
              icon={<AlignCenter size={16} />}
              command="justifyCenter"
            />
            <ToolbarButton
              icon={<AlignRight size={16} />}
              command="justifyRight"
            />
          </div>

          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <ToolbarButton
              icon={<List size={16} />}
              command="insertUnorderedList"
            />
            <ToolbarButton
              icon={<ListOrdered size={16} />}
              command="insertOrderedList"
            />
          </div>

          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <ToolbarButton icon={<Link size={16} />} onClick={insertLink} />
            <ToolbarButton icon={<Image size={16} />} onClick={insertImage} />
          </div>

          <ToolbarButton
            icon={<Code size={16} />}
            onClick={() => setIsCodeView(!isCodeView)}
            active={isCodeView}
          />
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        {isCodeView ? (
          <textarea
            className={`w-full ${
              compact ? "h-48" : "h-96"
            } p-4 font-mono text-sm border-none resize-none focus:outline-none`}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your HTML/Markdown here..."
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            className={`${
              compact ? "min-h-48" : "min-h-96"
            } p-4 focus:outline-none`}
            style={{ minHeight: compact ? "192px" : "384px" }}
            dir="ltr"
            onInput={(e) => {
              e.stopPropagation();
              handleContentChange();
            }}
            onBlur={(e) => {
              e.stopPropagation();
              handleContentChange();
            }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />
        )}
      </div>
    </div>
  );
};

export default TextEditor;
