import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Code,
  Palette,
  Type,
} from "lucide-react";

const TipTapEditor = ({ content, onChange, placeholder, compact = false }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none ${
          compact ? "min-h-48 p-4" : "min-h-96 p-4"
        }`,
        "data-placeholder": placeholder,
      },
    },
  });

  const addLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setFontSize = useCallback(
    (size) => {
      editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
    },
    [editor]
  );

  const setTextColor = useCallback(
    (color) => {
      editor.chain().focus().setColor(color).run();
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ icon, onClick, isActive, disabled = false }) => (
    <button
      type="button"
      className={`p-2 rounded-lg transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-600"
          : "hover:bg-gray-100 text-gray-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
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
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <ToolbarButton
              icon={<Undo size={16} />}
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            />
            <ToolbarButton
              icon={<Redo size={16} />}
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            />
          </div>

          {/* Headings */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <select
              className={`text-sm border border-gray-200 rounded px-2 py-1 ${
                compact ? "text-xs" : ""
              }`}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "paragraph") {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: parseInt(value) })
                    .run();
                }
              }}
            >
              <option value="paragraph">Normal</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
            </select>
          </div>

          {/* Text Formatting */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <ToolbarButton
              icon={<Bold size={16} />}
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
            />
            <ToolbarButton
              icon={<Italic size={16} />}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
            />
            <ToolbarButton
              icon={<UnderlineIcon size={16} />}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
            />
          </div>

          {/* Font Size */}

          {/* Text Color */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <div className="flex items-center space-x-1">
              <Palette size={16} className="text-gray-600" />
              <input
                type="color"
                defaultValue="#000000"
                onChange={(e) => setTextColor(e.target.value)}
                className={`w-8 h-8 border border-gray-200 rounded cursor-pointer ${
                  compact ? "w-6 h-6" : ""
                }`}
                title="Text Color"
              />
            </div>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <ToolbarButton
              icon={<AlignLeft size={16} />}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
            />
            <ToolbarButton
              icon={<AlignCenter size={16} />}
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={editor.isActive({ textAlign: "center" })}
            />
            <ToolbarButton
              icon={<AlignRight size={16} />}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
            />
          </div>

          {/* Lists */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <ToolbarButton
              icon={<List size={16} />}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
            />
            <ToolbarButton
              icon={<ListOrdered size={16} />}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
            />
          </div>

          {/* Links and Images */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3">
            <ToolbarButton
              icon={<LinkIcon size={16} />}
              onClick={addLink}
              isActive={editor.isActive("link")}
            />
            <ToolbarButton icon={<ImageIcon size={16} />} onClick={addImage} />
          </div>

          {/* Code */}
          <ToolbarButton
            icon={<Code size={16} />}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
          />
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className={`${
            compact ? "min-h-48" : "min-h-96"
          } focus-within:outline-none`}
        />
      </div>
    </div>
  );
};

export default TipTapEditor;
