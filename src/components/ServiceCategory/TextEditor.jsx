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
  Palette,
  Type,
} from "lucide-react";

const TextEditor = ({ content, onChange, placeholder, compact = false }) => {
  const editorRef = useRef(null);
  const [isCodeView, setIsCodeView] = useState(false);
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    ul: false,
    ol: false,
  });
  const [currentFontSize, setCurrentFontSize] = useState("16px");
  const [currentColor, setCurrentColor] = useState("#000000");

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
    updateActiveStates();
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

  const changeFontSize = (size) => {
    setCurrentFontSize(size);
    executeCommand("fontSize", "7");
    const selection = document.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = size;
      try {
        range.surroundContents(span);
      } catch (e) {
        span.appendChild(range.extractContents());
        range.insertNode(span);
      }
      selection.removeAllRanges();
      selection.addRange(range);
    }
    handleContentChange();
  };

  const changeTextColor = (color) => {
    setCurrentColor(color);
    executeCommand("foreColor", color);
    handleContentChange();
  };

  const isSelectionInsideEditor = () => {
    const sel = document.getSelection();
    if (!sel || !sel.anchorNode || !editorRef.current) return false;
    return editorRef.current.contains(sel.anchorNode);
  };

  const getCurrentBlock = () => {
    const sel = document.getSelection();
    if (!sel || !sel.anchorNode) return null;
    let node =
      sel.anchorNode.nodeType === 3
        ? sel.anchorNode.parentNode
        : sel.anchorNode;
    while (node && node !== editorRef.current) {
      const display = window.getComputedStyle(node).display;
      if (
        display === "block" ||
        display === "list-item" ||
        /^H[1-6]$/.test(node.tagName)
      ) {
        return node;
      }
      node = node.parentNode;
    }
    return editorRef.current;
  };

  const updateActiveStates = () => {
    if (!editorRef.current || !isSelectionInsideEditor() || isCodeView) {
      setActive((prev) => ({
        ...prev,
        bold: false,
        italic: false,
        underline: false,
        alignLeft: false,
        alignCenter: false,
        alignRight: false,
        ul: false,
        ol: false,
      }));
      return;
    }

    let bold = false;
    let italic = false;
    let underline = false;
    let ul = false;
    let ol = false;
    try {
      bold = document.queryCommandState("bold");
      italic = document.queryCommandState("italic");
      underline = document.queryCommandState("underline");
      ul = document.queryCommandState("insertUnorderedList");
      ol = document.queryCommandState("insertOrderedList");
    } catch (_) {}

    const block = getCurrentBlock();
    const align = block ? window.getComputedStyle(block).textAlign : "left";
    const alignLeft = align === "left" || align === "start";
    const alignCenter = align === "center";
    const alignRight = align === "right" || align === "end";

    setActive({
      bold,
      italic,
      underline,
      ul,
      ol,
      alignLeft,
      alignCenter,
      alignRight,
    });
  };

  useEffect(() => {
    const handler = () => updateActiveStates();
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, [isCodeView]);

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
            <ToolbarButton
              icon={<Bold size={16} />}
              command="bold"
              active={active.bold}
            />
            <ToolbarButton
              icon={<Italic size={16} />}
              command="italic"
              active={active.italic}
            />
            <ToolbarButton
              icon={<Underline size={16} />}
              command="underline"
              active={active.underline}
            />
          </div>

          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <div className="flex items-center space-x-1">
              <Type size={16} className="text-gray-600" />
              <select
                className={`text-sm border border-gray-200 rounded px-2 py-1 ${
                  compact ? "text-xs" : ""
                }`}
                value={currentFontSize}
                onChange={(e) => changeFontSize(e.target.value)}
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="28px">28px</option>
                <option value="32px">32px</option>
                <option value="36px">36px</option>
                <option value="48px">48px</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <div className="flex items-center space-x-1">
              <Palette size={16} className="text-gray-600" />
              <input
                type="color"
                value={currentColor}
                onChange={(e) => changeTextColor(e.target.value)}
                className={`w-8 h-8 border border-gray-200 rounded cursor-pointer ${
                  compact ? "w-6 h-6" : ""
                }`}
                title="Text Color"
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <ToolbarButton
              icon={<AlignLeft size={16} />}
              command="justifyLeft"
              active={active.alignLeft}
            />
            <ToolbarButton
              icon={<AlignCenter size={16} />}
              command="justifyCenter"
              active={active.alignCenter}
            />
            <ToolbarButton
              icon={<AlignRight size={16} />}
              command="justifyRight"
              active={active.alignRight}
            />
          </div>

          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <ToolbarButton
              icon={<List size={16} />}
              command="insertUnorderedList"
              active={active.ul}
            />
            <ToolbarButton
              icon={<ListOrdered size={16} />}
              command="insertOrderedList"
              active={active.ol}
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
            } p-4 focus:outline-none prose prose-sm max-w-none`}
            style={{ minHeight: compact ? "192px" : "384px" }}
            dir="ltr"
            onInput={(e) => {
              e.stopPropagation();
              handleContentChange();
              updateActiveStates();
            }}
            onBlur={(e) => {
              e.stopPropagation();
              handleContentChange();
              updateActiveStates();
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
