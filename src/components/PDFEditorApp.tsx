
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { PDFViewer } from './pdf/PDFViewer';
import { TextOverlay } from './pdf/TextOverlay';
import { TopBar } from './pdf/TopBar';
import { FloatingToolbar } from './pdf/FloatingToolbar';
import { usePDFState } from '@/hooks/usePDFState';
import { PDFDocument } from '@/types/pdf';

interface PDFEditorAppProps {
  document: PDFDocument;
}

export const PDFEditorApp: React.FC<PDFEditorAppProps> = ({ document: initialDocument }) => {
  const {
    document,
    updateTextElement,
    addTextElement,
    deleteTextElement,
    undo,
    redo,
    saveChanges,
    canUndo,
    canRedo,
    hasUnsavedChanges
  } = usePDFState(initialDocument);

  const [scale, setScale] = useState(1);
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'pan'>('select');
  const [pageCanvases, setPageCanvases] = useState<Map<number, HTMLCanvasElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        } else if (e.key === 's') {
          e.preventDefault();
          handleSave();
        }
      }
      
      // Tool shortcuts
      if (e.key === 'v' || e.key === 'V') {
        setActiveTool('select');
      } else if (e.key === 't' || e.key === 'T') {
        setActiveTool('text');
      } else if (e.key === 'h' || e.key === 'H') {
        setActiveTool('pan');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handlePageRender = useCallback((pageNumber: number, canvas: HTMLCanvasElement) => {
    setPageCanvases(prev => new Map(prev.set(pageNumber, canvas)));
  }, []);

  const handleAddElement = useCallback((x: number, y: number, pageNumber: number = 1) => {
    if (activeTool === 'text') {
      const elementId = addTextElement(x, y, pageNumber);
      toast.success('Campo de texto adicionado');
      return elementId;
    }
  }, [activeTool, addTextElement]);

  const handleSave = useCallback(async () => {
    try {
      await saveChanges();
      toast.success('Alterações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar alterações');
    }
  }, [saveChanges]);

  const handleExport = useCallback(async () => {
    try {
      // Aqui seria a integração com pdf-lib para gerar o PDF modificado
      const blob = new Blob(['PDF modificado simulado'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name.replace('.pdf', '_editado.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar PDF');
    }
  }, [document.name]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar
        document={document}
        onSave={handleSave}
        onExport={handleExport}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        scale={scale}
        onScaleChange={setScale}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <FloatingToolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8" ref={containerRef}>
          <div className="space-y-8">
            {Array.from({ length: document.pages }, (_, index) => {
              const pageNumber = index + 1;
              const canvas = pageCanvases.get(pageNumber);
              
              return (
                <div key={pageNumber} className="relative bg-white shadow-lg rounded-lg overflow-hidden">
                  {/* Canvas de fundo do PDF */}
                  {canvas && (
                    <div className="relative">
                      <canvas
                        ref={(ref) => {
                          if (ref && canvas) {
                            const ctx = ref.getContext('2d');
                            if (ctx) {
                              ref.width = canvas.width * scale;
                              ref.height = canvas.height * scale;
                              ctx.scale(scale, scale);
                              ctx.drawImage(canvas, 0, 0);
                            }
                          }
                        }}
                        className="block w-full h-auto"
                      />
                      
                      {/* Overlay para edição de texto */}
                      <TextOverlay
                        textElements={document.textElements}
                        pageNumber={pageNumber}
                        pageWidth={canvas.width}
                        pageHeight={canvas.height}
                        scale={scale}
                        onUpdateElement={updateTextElement}
                        onDeleteElement={deleteTextElement}
                        onAddElement={(x, y) => handleAddElement(x, y, pageNumber)}
                      />
                    </div>
                  )}
                  
                  {/* Indicador de página */}
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    Página {pageNumber}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <PDFViewer
        document={document}
        onPageRender={handlePageRender}
        scale={scale}
      >
        <div />
      </PDFViewer>
    </div>
  );
};
