import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
}

const MenuButton = ({ 
  onClick, 
  isActive, 
  icon, 
  title 
}: { 
  onClick: () => void; 
  isActive: boolean; 
  icon: string;
  title: string;
}) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
    className={`p-1.5 rounded-md transition-colors ${
      isActive 
        ? 'bg-primary-container text-on-primary-container' 
        : 'hover:bg-surface-container-high text-on-surface-variant'
    }`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
  </button>
);

export const RichTextEditor = ({ content, onChange, label, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none w-full min-h-[150px] px-4 py-3 font-body-md text-body-md text-on-surface',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
      {label && (
        <label className="absolute -top-2 left-2 z-10 bg-surface-container-lowest px-1 font-label-small text-label-small text-primary">
          {label}
        </label>
      )}
      
      <div className="w-full rounded border border-outline bg-transparent focus-within:border-primary focus-within:border-2 transition-all flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 p-1 border-b border-outline-variant bg-surface-container-low shrink-0 rounded-t">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon="format_bold"
            title="Bold"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon="format_italic"
            title="Italic"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            icon="format_underlined"
            title="Underline"
          />
          <div className="w-px h-6 bg-outline-variant mx-1" />
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon="format_list_bulleted"
            title="Bullet List"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon="format_list_numbered"
            title="Ordered List"
          />
          <div className="w-px h-6 bg-outline-variant mx-1" />
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            isActive={false}
            icon="undo"
            title="Undo"
          />
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            isActive={false}
            icon="redo"
            title="Redo"
          />
        </div>

        <div className="flex-1 overflow-y-auto cursor-text bg-transparent" onClick={() => editor.chain().focus().run()}>
          <EditorContent editor={editor} />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .tiptap-editor p.is-editor-empty:first-child::before {
          content: '${placeholder || ""}';
          position: absolute;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .tiptap-editor { outline: none; }
        .tiptap-editor > *:first-child { margin-top: 0 !important; }
        .tiptap-editor > *:last-child { margin-bottom: 0 !important; }
        .tiptap-editor p { margin: 0 !important; line-height: inherit; }
        
        .tiptap-editor ul, .tiptap-editor ul > li { list-style-type: disc !important; }
        .tiptap-editor ol, .tiptap-editor ol > li { list-style-type: decimal !important; }
        .tiptap-editor ul, .tiptap-editor ol { padding-left: 1.5rem; margin: 0 !important; }
        
        .tiptap-editor li > p { margin: 0 !important; }
      `}} />
    </div>
  );
};
