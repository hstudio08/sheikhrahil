"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Heading2, 
  Quote, 
  List, 
  ListOrdered, 
  Undo, 
  Redo 
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = "Write here..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-stone prose-headings:font-serif prose-p:font-body max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-sm bg-white overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-background/50">
        <div className="flex items-center space-x-1 border-r border-border pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-sm transition-colors ${editor.isActive("bold") ? "bg-primary text-white" : "hover:bg-background text-muted-foreground"}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-sm transition-colors ${editor.isActive("italic") ? "bg-primary text-white" : "hover:bg-background text-muted-foreground"}`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-sm transition-colors ${editor.isActive("underline") ? "bg-primary text-white" : "hover:bg-background text-muted-foreground"}`}
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r border-border pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded-sm transition-colors ${editor.isActive({ textAlign: "left" }) ? "bg-primary text-white" : "hover:bg-background text-muted-foreground"}`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded-sm transition-colors ${editor.isActive({ textAlign: "center" }) ? "bg-primary text-white" : "hover:bg-background text-muted-foreground"}`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded-sm transition-colors ${editor.isActive({ textAlign: "right" }) ? "bg-primary text-white" : "hover:bg-background text-muted-foreground"}`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r border-border pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-sm transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-primary text-white" : "hover:bg-background text-muted-foreground"}`}
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-sm transition-colors ${editor.isActive("blockquote") ? "bg-primary text-white" : "hover:bg-background text-muted-foreground"}`}
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 border-r border-border pr-2 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-sm transition-colors ${editor.isActive("bulletList") ? "bg-primary text-white" : "hover:bg-background text-muted-foreground"}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-sm transition-colors ${editor.isActive("orderedList") ? "bg-primary text-white" : "hover:bg-background text-muted-foreground"}`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 ml-auto">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded-sm transition-colors hover:bg-background text-muted-foreground disabled:opacity-50"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded-sm transition-colors hover:bg-background text-muted-foreground disabled:opacity-50"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 cursor-text bg-white">
        <EditorContent editor={editor} />
      </div>
      
      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          color: #a3a3a3;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}