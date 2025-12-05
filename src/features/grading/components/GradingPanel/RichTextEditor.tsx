import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import EditorImageModal from "./EditorImageModal";
import { ResizableImage } from "tiptap-extension-resizable-image";
import "tiptap-extension-resizable-image/styles.css";

import styles from "./RichTextEditor.module.css";

export default function RichTextEditor({
    value,
    onChange,
}: {
    value: string;
    onChange: (html: string) => void;
}) {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true },
                orderedList: { keepMarks: true },
                listItem: {},
            }),
            Highlight,
            Placeholder.configure({
                placeholder: "Escribí aquí tu corrección...",
            }),
            ResizableImage.configure({
                allowBase64: true,
                inline: false,
                defaultWidth: 300,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: styles.editor, // 👈 acá va la clase del nodo ProseMirror
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    const handleInsertImages = (files: File[]) => {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === "string" && editor) {
                    editor.chain().focus().setResizableImage({ src: result }).run();
                }
            };
            reader.readAsDataURL(file);
        });
    };


    if (!editor) return null;

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <button
                    className={`${styles.btn} ${editor.isActive("bold") ? styles.active : ""
                        }`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    Negrita
                </button>

                <button
                    className={`${styles.btn} ${editor.isActive("italic") ? styles.active : ""
                        }`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    Cursiva
                </button>

                <button
                    className={`${styles.btn} ${editor.isActive("highlight") ? styles.active : ""
                        }`}
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                >
                    Resaltar
                </button>

                <button
                    className={`${styles.btn} ${editor.isActive("bulletList") ? styles.active : ""
                        }`}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    • Lista
                </button>

                <button
                    className={`${styles.btn} ${editor.isActive("orderedList") ? styles.active : ""
                        }`}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    1. Lista
                </button>

                <button
                    className={styles.btn}
                    onClick={() => setIsImageModalOpen(true)}
                >
                    Imagen
                </button>

                <button
                    className={styles.btn}
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    ↺ Undo
                </button>

                <button
                    className={styles.btn}
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    ↻ Redo
                </button>
            </div>

            <EditorContent editor={editor} />

            <EditorImageModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                onInsert={handleInsertImages}
            />
        </div>
    );
}
