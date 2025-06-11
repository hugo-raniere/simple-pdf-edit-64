
export interface PDFTextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  page: number;
  isNew: boolean;
  color?: string;
}

export interface PDFDocument {
  file: File;
  name: string;
  pages: number;
  textElements: PDFTextElement[];
  pdfData?: ArrayBuffer;
}

export interface EditableTextProps {
  element: PDFTextElement;
  onChange: (id: string, updates: Partial<PDFTextElement>) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  scale: number;
}
