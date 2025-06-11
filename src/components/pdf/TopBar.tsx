
import React from 'react';
import { Save, Download, FileText, Undo, Redo, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDFDocument } from '@/types/pdf';

interface TopBarProps {
  document: PDFDocument;
  onSave: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  scale: number;
  onScaleChange: (scale: number) => void;
  hasUnsavedChanges: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  document,
  onSave,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  scale,
  onScaleChange,
  hasUnsavedChanges
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Left side - Document info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-medium text-foreground">{document.name}</h1>
            <p className="text-sm text-muted-foreground">
              {document.pages} página{document.pages > 1 ? 's' : ''}
              {hasUnsavedChanges && (
                <span className="ml-2 text-orange-600">• Não salvo</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Center - Tools */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Desfazer (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Refazer (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
          title="Diminuir zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <span className="text-sm text-muted-foreground min-w-12 text-center">
          {Math.round(scale * 100)}%
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onScaleChange(Math.min(2, scale + 0.1))}
          title="Aumentar zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          onClick={onSave}
          disabled={!hasUnsavedChanges}
          className="px-4 py-2"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar alterações
        </Button>

        <Button
          onClick={onExport}
          className="px-4 py-2"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
};
