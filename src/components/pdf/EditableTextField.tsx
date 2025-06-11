
import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { Trash2, Move, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditableTextProps } from '@/types/pdf';

export const EditableTextField: React.FC<EditableTextProps> = ({
  element,
  onChange,
  onDelete,
  isSelected,
  onSelect,
  scale
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(element.text);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setText(element.text);
  }, [element.text]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    onChange(element.id, { text: newText });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.focus();
      }
    }, 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setText(element.text);
    }
  };

  const handleDrag = (e: any, data: any) => {
    onChange(element.id, {
      x: data.x / scale,
      y: data.y / scale
    });
  };

  const handleResize = (e: any, { size }: any) => {
    onChange(element.id, {
      width: size.width / scale,
      height: size.height / scale
    });
  };

  return (
    <Draggable
      position={{ x: element.x * scale, y: element.y * scale }}
      onDrag={handleDrag}
      disabled={isEditing}
      handle=".drag-handle"
    >
      <div
        className={`absolute cursor-pointer group ${
          isSelected ? 'ring-2 ring-primary ring-opacity-50' : ''
        }`}
        onClick={() => onSelect(element.id)}
      >
        <ResizableBox
          width={element.width * scale}
          height={element.height * scale}
          onResize={handleResize}
          minConstraints={[50 * scale, 20 * scale]}
          resizeHandles={isSelected ? ['se'] : []}
          handle={
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity" />
          }
        >
          <div
            className={`
              relative w-full h-full min-h-6 px-2 py-1 border border-transparent rounded
              ${isEditing ? 'bg-white border-primary shadow-sm' : 'hover:bg-primary/5 hover:border-primary/20'}
              ${element.isNew ? 'bg-blue-50 border-blue-200' : ''}
              transition-all duration-200
            `}
            style={{
              fontSize: element.fontSize * scale,
              fontFamily: element.fontFamily,
              color: element.color || '#000000'
            }}
          >
            {isEditing ? (
              <div
                ref={textRef}
                contentEditable
                suppressContentEditableWarning
                className="w-full h-full outline-none resize-none bg-transparent"
                onInput={(e) => handleTextChange(e.currentTarget.textContent || '')}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              >
                {text}
              </div>
            ) : (
              <div
                className="w-full h-full break-words"
                onDoubleClick={handleDoubleClick}
              >
                {text || 'Clique para editar'}
              </div>
            )}

            {/* Controles quando selecionado */}
            {isSelected && !isEditing && (
              <div className="absolute -top-8 left-0 flex items-center space-x-1 bg-white shadow-md rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="drag-handle cursor-move p-1 hover:bg-gray-100 rounded">
                  <Move className="w-3 h-3" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onDelete(element.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </ResizableBox>
      </div>
    </Draggable>
  );
};
