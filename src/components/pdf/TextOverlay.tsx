
import React, { useState, useCallback } from 'react';
import { EditableTextField } from './EditableTextField';
import { PDFTextElement } from '@/types/pdf';

interface TextOverlayProps {
  textElements: PDFTextElement[];
  pageNumber: number;
  pageWidth: number;
  pageHeight: number;
  scale: number;
  onUpdateElement: (id: string, updates: Partial<PDFTextElement>) => void;
  onDeleteElement: (id: string) => void;
  onAddElement: (x: number, y: number) => void;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  textElements,
  pageNumber,
  pageWidth,
  pageHeight,
  scale,
  onUpdateElement,
  onDeleteElement,
  onAddElement
}) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const pageElements = textElements.filter(element => element.page === pageNumber);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      
      onAddElement(x, y);
    }
  }, [scale, onAddElement]);

  const handleElementSelect = (id: string) => {
    setSelectedElementId(id);
  };

  return (
    <div
      className="absolute inset-0 cursor-crosshair"
      style={{
        width: pageWidth * scale,
        height: pageHeight * scale
      }}
      onClick={handleOverlayClick}
    >
      {pageElements.map((element) => (
        <EditableTextField
          key={element.id}
          element={element}
          onChange={onUpdateElement}
          onDelete={onDeleteElement}
          isSelected={selectedElementId === element.id}
          onSelect={handleElementSelect}
          scale={scale}
        />
      ))}
    </div>
  );
};
