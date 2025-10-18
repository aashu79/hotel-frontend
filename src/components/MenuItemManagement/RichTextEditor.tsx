import { useState, useEffect } from "react";
import "./RichTextEditor.css";

// Use dynamic import for React Quill to avoid SSR issues
import ReactQuill from "react-quill";
// Import styles in useEffect to prevent SSR issues
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
];

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) => {
  // Add dark class to parent element when component mounts
  useEffect(() => {
    // Add a class to help with styling the quill editor in dark mode
    const quillElements = document.querySelectorAll(".quill");
    quillElements.forEach((element) => {
      if (element) {
        element.classList.add("dark-theme");
      }
    });
  }, []);

  return (
    <div className="rich-text-wrapper">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Write a description..."}
      />
    </div>
  );
};

export default RichTextEditor;
