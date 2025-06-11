import React, { useCallback, useEffect } from 'react';
import { Download, Undo, Redo, FileText, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PDFDocument, PDFTextElement } from '@/types/pdf';

interface PDFEditorProps {
  document: PDFDocument;
  onUpdateText: (id: string, text: string) => void;
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onBack: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const PDFEditor: React.FC<PDFEditorProps> = ({
  document,
  onUpdateText,
  onDownload,
  onUndo,
  onRedo,
  onBack,
  canUndo,
  canRedo
}) => {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          onUndo();
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          onRedo();
        } else if (e.key === 's') {
          e.preventDefault();
          onDownload();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, onDownload]);

  const handleTextChange = useCallback((id: string, newText: string) => {
    onUpdateText(id, newText);
  }, [onUpdateText]);

  const handleDownload = useCallback(() => {
    onDownload();
    toast.success('PDF baixado com sucesso!');
  }, [onDownload]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-medium text-foreground">{document.name}</h1>
              <p className="text-sm text-muted-foreground">
                {document.pages} página{document.pages > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

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
            onClick={handleDownload}
            className="px-6 py-2 h-auto font-medium"
            title="Baixar PDF (Ctrl+S)"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </header>

      {/* Editor Content */}
      <main className="flex-1 overflow-auto bg-muted/30">
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            {/* PDF Viewer */}
            <div className="relative bg-white min-h-[800px] p-8">
              {/* Simulated PDF background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
              
              {/* Text overlay layer */}
              <div className="relative z-10">
                {document.textElements.map((element) => (
                  <EditableText
                    key={element.id}
                    element={element}
                    onChange={handleTextChange}
                  />
                ))}
              </div>

              {/* Instructions */}
              <div className="absolute bottom-4 right-4 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium">
                Clique em qualquer texto para editar
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-card rounded-xl p-6 border border-border">
            <h3 className="font-medium text-foreground mb-3">Dicas de uso:</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Clique em qualquer texto para editá-lo</p>
              <p>• Use Ctrl+Z para desfazer e Ctrl+Y para refazer</p>
              <p>• Pressione Ctrl+S para baixar o PDF editado</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface EditableTextProps {
  element: PDFTextElement;
  onChange: (id: string, text: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({ element, onChange }) => {
  const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    const newText = e.target.textContent || '';
    if (newText !== element.text) {
      onChange(element.id, newText);
    }
  }, [element.id, element.text, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }, []);

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className="pdf-text-editable absolute cursor-text focus:cursor-text"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        minHeight: element.height,
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        lineHeight: 1.2,
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {element.text}
    </div>
  );
};
