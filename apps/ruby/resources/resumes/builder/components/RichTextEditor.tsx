import type { EditorRefType } from '@common/types';
import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HighlighterIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  PaletteIcon,
  QuoteIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
  XIcon,
} from 'lucide-react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

interface RichTextEditorProps {
  content?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  minHeight?: string;
  className?: string;
  maxCharacters?: number;
  showCharacterCount?: boolean;
}

const TEXT_COLORS = [
  { name: 'Default', value: '' },
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Yellow', value: '#CA8A04' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Purple', value: '#9333EA' },
  { name: 'Pink', value: '#EC4899' },
];

const HIGHLIGHT_COLORS = [
  { name: 'None', value: '' },
  { name: 'Yellow', value: '#FEF08A' },
  { name: 'Green', value: '#BBF7D0' },
  { name: 'Blue', value: '#BFDBFE' },
  { name: 'Pink', value: '#FBCFE8' },
  { name: 'Purple', value: '#E9D5FF' },
  { name: 'Orange', value: '#FED7AA' },
];

export const RichTextEditor = forwardRef<EditorRefType, RichTextEditorProps>(
  (
    {
      content = '',
      placeholder = 'Start typing...',
      onChange,
      minHeight = '100px',
      className,
      maxCharacters,
      showCharacterCount = true,
    },
    ref,
  ) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHighlightPicker, setShowHighlightPicker] = useState(false);
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          bulletList: { keepMarks: true },
          orderedList: { keepMarks: true },
          heading: { levels: [1, 2, 3] },
          codeBlock: {
            HTMLAttributes: {
              class: 'bg-gray-100 rounded-md p-3 font-mono text-sm',
            },
          },
          blockquote: {
            HTMLAttributes: {
              class: 'border-l-4 border-gray-300 pl-4 italic text-gray-600',
            },
          },
          horizontalRule: {
            HTMLAttributes: {
              class: 'my-4 border-t border-gray-300',
            },
          },
        }),
        Underline,
        Placeholder.configure({ placeholder }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { class: 'text-blue-600 underline cursor-pointer' },
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Color,
        Highlight.configure({
          multicolor: true,
        }),
        CharacterCount.configure({
          limit: maxCharacters,
        }),
      ],
      content,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: `prose prose-sm max-w-none focus:outline-none ${className || ''}`,
          style: `min-height: ${minHeight}`,
        },
      },
    });

    // Expose editor methods via ref
    useImperativeHandle(ref, () => ({
      getContent: () => editor?.getHTML() || '',
      getEditor: () => editor,
      setContent: (html: string) => editor?.commands.setContent(html),
      insertContent: (html: string) => editor?.commands.insertContent(html),
      insertContentAt: (pos: number, html: string) =>
        editor?.commands.insertContentAt(pos, html),
      deleteSelection: () => editor?.commands.deleteSelection(),
      focus: () => editor?.commands.focus(),
      blur: () => editor?.commands.blur(),
    }));

    // Sync content prop changes
    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }, [content, editor]);

    // Close dropdowns when clicking outside
    useEffect(() => {
      const handleClickOutside = () => {
        setShowColorPicker(false);
        setShowHighlightPicker(false);
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const setLink = useCallback(() => {
      if (!editor) return;

      if (linkUrl === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url })
          .run();
      }
      setShowLinkDialog(false);
      setLinkUrl('');
    }, [editor, linkUrl]);

    const openLinkDialog = useCallback(() => {
      if (!editor) return;
      const previousUrl = editor.getAttributes('link').href || '';
      setLinkUrl(previousUrl);
      setShowLinkDialog(true);
    }, [editor]);

    const characterCount = editor?.storage.characterCount.characters() ?? 0;
    const wordCount = editor?.storage.characterCount.words() ?? 0;

    return (
      <div className="border border-primary rounded-lg overflow-y-scroll">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 p-1.5 border-b border-primary bg-primary/20 flex-wrap">
          {/* Undo/Redo */}
          <ToolbarButton
            onClick={() => editor?.chain().focus().undo().run()}
            active={false}
            title="Undo (Ctrl+Z)"
            disabled={!editor?.can().undo()}
          >
            <Undo2Icon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().redo().run()}
            active={false}
            title="Redo (Ctrl+Shift+Z)"
            disabled={!editor?.can().redo()}
          >
            <Redo2Icon className="w-4 h-4" />
          </ToolbarButton>

          <Divider />

          {/* Headings */}
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor?.isActive('heading', { level: 1 }) ?? false}
            title="Heading 1 (Ctrl+Alt+1)"
            disabled={!editor}
          >
            <Heading1Icon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor?.isActive('heading', { level: 2 }) ?? false}
            title="Heading 2 (Ctrl+Alt+2)"
            disabled={!editor}
          >
            <Heading2Icon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor?.isActive('heading', { level: 3 }) ?? false}
            title="Heading 3 (Ctrl+Alt+3)"
            disabled={!editor}
          >
            <Heading3Icon className="w-4 h-4" />
          </ToolbarButton>

          <Divider />

          {/* Text formatting */}
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive('bold') ?? false}
            title="Bold (Ctrl+B)"
            disabled={!editor}
          >
            <BoldIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive('italic') ?? false}
            title="Italic (Ctrl+I)"
            disabled={!editor}
          >
            <ItalicIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            active={editor?.isActive('underline') ?? false}
            title="Underline (Ctrl+U)"
            disabled={!editor}
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            active={editor?.isActive('strike') ?? false}
            title="Strikethrough (Ctrl+Shift+S)"
            disabled={!editor}
          >
            <StrikethroughIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCode().run()}
            active={editor?.isActive('code') ?? false}
            title="Inline Code (Ctrl+E)"
            disabled={!editor}
          >
            <CodeIcon className="w-4 h-4" />
          </ToolbarButton>

          <Divider />

          {/* Text alignment */}
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
            active={editor?.isActive({ textAlign: 'left' }) ?? false}
            title="Align Left"
            disabled={!editor}
          >
            <AlignLeftIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
            active={editor?.isActive({ textAlign: 'center' }) ?? false}
            title="Align Center"
            disabled={!editor}
          >
            <AlignCenterIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
            active={editor?.isActive({ textAlign: 'right' }) ?? false}
            title="Align Right"
            disabled={!editor}
          >
            <AlignRightIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().setTextAlign('justify').run()
            }
            active={editor?.isActive({ textAlign: 'justify' }) ?? false}
            title="Justify"
            disabled={!editor}
          >
            <AlignJustifyIcon className="w-4 h-4" />
          </ToolbarButton>

          <Divider />

          {/* Lists & Blocks */}
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            active={editor?.isActive('bulletList') ?? false}
            title="Bullet List"
            disabled={!editor}
          >
            <ListIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive('orderedList') ?? false}
            title="Numbered List"
            disabled={!editor}
          >
            <ListOrderedIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            active={editor?.isActive('blockquote') ?? false}
            title="Blockquote"
            disabled={!editor}
          >
            <QuoteIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            active={false}
            title="Horizontal Rule"
            disabled={!editor}
          >
            <MinusIcon className="w-4 h-4" />
          </ToolbarButton>

          <Divider />

          {/* Link */}
          <ToolbarButton
            onClick={openLinkDialog}
            active={editor?.isActive('link') ?? false}
            title="Insert Link (Ctrl+K)"
            disabled={!editor}
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>

          {/* Color picker */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <ToolbarButton
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              active={showColorPicker}
              title="Text Color"
              disabled={!editor}
            >
              <PaletteIcon className="w-4 h-4" />
              <ChevronDownIcon className="w-3 h-3" />
            </ToolbarButton>
            {showColorPicker && (
              <ColorPickerDropdown
                colors={TEXT_COLORS}
                onSelect={(color) => {
                  if (color) {
                    editor?.chain().focus().setColor(color).run();
                  } else {
                    editor?.chain().focus().unsetColor().run();
                  }
                  setShowColorPicker(false);
                }}
              />
            )}
          </div>

          {/* Highlight picker */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <ToolbarButton
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              active={showHighlightPicker}
              title="Highlight"
              disabled={!editor}
            >
              <HighlighterIcon className="w-4 h-4" />
              <ChevronDownIcon className="w-3 h-3" />
            </ToolbarButton>
            {showHighlightPicker && (
              <ColorPickerDropdown
                colors={HIGHLIGHT_COLORS}
                onSelect={(color) => {
                  if (color) {
                    editor?.chain().focus().toggleHighlight({ color }).run();
                  } else {
                    editor?.chain().focus().unsetHighlight().run();
                  }
                  setShowHighlightPicker(false);
                }}
              />
            )}
          </div>

          <Divider />

          {/* Clear formatting */}
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().clearNodes().unsetAllMarks().run()
            }
            active={false}
            title="Clear Formatting"
            disabled={!editor}
          >
            <RemoveFormattingIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* Link Dialog */}
        {showLinkDialog && (
          <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/20">
            <LinkIcon className="w-4 h-4 text-muted-foreground" />
            <input
              type="url"
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setLink();
                }
                if (e.key === 'Escape') {
                  setShowLinkDialog(false);
                  setLinkUrl('');
                }
              }}
              className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={setLink}
              className="px-2 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
            >
              {linkUrl ? 'Apply' : 'Remove'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkDialog(false);
                setLinkUrl('');
              }}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Editor */}
        {editor ? (
          <EditorContent editor={editor} className="p-3" />
        ) : (
          <div className="p-3" style={{ minHeight }}>
            <span className="text-muted-foreground text-sm">
              Loading editor...
            </span>
          </div>
        )}

        {/* Character/Word Count */}
        {showCharacterCount && editor && (
          <div className="flex items-center justify-end gap-3 px-3 py-1.5 border-t border-border text-xs text-muted-foreground">
            <span>{wordCount} words</span>
            <span>
              {characterCount}
              {maxCharacters ? ` / ${maxCharacters}` : ''} characters
            </span>
          </div>
        )}
      </div>
    );
  },
);

// Toolbar button component
const ToolbarButton = ({
  onClick,
  active,
  title,
  disabled,
  children,
}: {
  onClick: () => void;
  active: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-0.5 ${
      active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
    }`}
  >
    {children}
  </button>
);

// Divider component
const Divider = () => <div className="w-px h-5 bg-border mx-1" />;

// Color picker dropdown
const ColorPickerDropdown = ({
  colors,
  onSelect,
}: {
  colors: { name: string; value: string }[];
  onSelect: (value: string) => void;
}) => (
  <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-border rounded-lg shadow-lg z-10 min-w-32">
    <div className="grid grid-cols-5 gap-1">
      {colors.map((color) => (
        <button
          key={color.name}
          type="button"
          title={color.name}
          onClick={() => onSelect(color.value)}
          className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
          style={{
            backgroundColor: color.value || '#ffffff',
            backgroundImage: !color.value
              ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
              : undefined,
            backgroundSize: !color.value ? '8px 8px' : undefined,
            backgroundPosition: !color.value
              ? '0 0, 0 4px, 4px -4px, -4px 0px'
              : undefined,
          }}
        />
      ))}
    </div>
  </div>
);
