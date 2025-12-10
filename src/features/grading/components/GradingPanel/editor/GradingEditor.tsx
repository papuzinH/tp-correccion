import { memo } from 'react';
import RichTextEditor from './RichTextEditor';

interface GradingEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export const GradingEditor = memo(({ value, onChange }: GradingEditorProps) => {
  return (
    <RichTextEditor
      value={value}
      onChange={onChange}
    />
  );
});

GradingEditor.displayName = 'GradingEditor';
