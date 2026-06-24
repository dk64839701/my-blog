"use client";

import { RefObject } from "react";

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  content: string,
  setContent: (value: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = content.slice(start, end);

  setContent(content.slice(0, start) + before + selected + after + content.slice(end));

  requestAnimationFrame(() => {
    textarea.focus();
    const cursorStart = start + before.length;
    textarea.setSelectionRange(cursorStart, cursorStart + selected.length);
  });
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  width: "32px",
  height: "32px",
  cursor: "pointer",
  fontSize: "14px",
  color: "#374151",
};

export default function EditorToolbar({
  textareaRef,
  content,
  setContent,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  content: string;
  setContent: (value: string) => void;
}) {
  const apply = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    wrapSelection(textarea, before, after, content, setContent);
  };

  return (
    <div className="flex gap-2 mb-2">
      <button type="button" onClick={() => apply("**", "**")} style={buttonStyle} title="굵게">
        <b>B</b>
      </button>
      <button type="button" onClick={() => apply("*", "*")} style={buttonStyle} title="기울임">
        <i>I</i>
      </button>
      <button type="button" onClick={() => apply("<u>", "</u>")} style={buttonStyle} title="밑줄">
        <u>U</u>
      </button>
    </div>
  );
}
