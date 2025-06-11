
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';
import Draggable from 'react-draggable';
import { Download, Plus, ArrowLeft, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Configurar worker do react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
}

const Edit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const pdfData = location.state?.pdfData;
  const fileName = location.state?.fileName || 'documento.pdf';

  useEffect(() => {
    if (!pdfData) {
      toast.error('Nenhum PDF carregado');
      navigate('/');
    }
  }, [pdfData, navigate]);

  const addTextElement = () => {
    const newElement: TextElement = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'Novo texto',
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50
    };
    setTextElements([...textElements, newElement]);
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(elements =>
      elements.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  };

  const removeTextElement = (id: string) => {
    setTextElements(elements => elements.filter(el => el.id !== id));
  };

  const exportPDF = async () => {
    if (!pdfData) return;

    setIsExporting(true);
    toast.loading('Exportando PDF...');

    try {
      const pdfDoc = await PDFDocument.load(pdfData);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      textElements.forEach(({ text, x, y }) => {
        firstPage.drawText(text, {
          x: x,
          y: firstPage.getHeight() - y - 20, // Ajustar coordenadas Y
          size: 12,
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.replace('.pdf', '_editado.pdf');
      link.click();

      URL.revokeObjectURL(url);
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar PDF');
    } finally {
      setIsExporting(false);
    }
  };

  if (!pdfData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header fixo */}
      <div className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-lg font-semibold">Editor de PDF</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addTextElement}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Texto
            </Button>
            <Button
              onClick={exportPDF}
              disabled={isExporting}
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exportando...' : 'Exportar PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="pt-20 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
            <Document
              file={pdfData}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className="pdf-document"
            >
              {numPages && Array.from(new Array(numPages), (_, index) => (
                <div key={index} className="relative">
                  <Page
                    pageNumber={index + 1}
                    className="pdf-page"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                  
                  {/* Overlay de texto apenas na primeira página */}
                  {index === 0 && (
                    <div className="absolute inset-0 pointer-events-none">
                      {textElements.map((element) => (
                        <Draggable
                          key={element.id}
                          position={{ x: element.x, y: element.y }}
                          onDrag={(e, data) => {
                            updateTextElement(element.id, {
                              x: data.x,
                              y: data.y
                            });
                          }}
                        >
                          <div
                            className="absolute pointer-events-auto group cursor-move"
                            style={{
                              transform: 'none',
                            }}
                          >
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              className="px-2 py-1 bg-white bg-opacity-90 border border-primary/20 rounded text-sm min-w-20 min-h-6 outline-none focus:bg-white focus:border-primary focus:shadow-sm"
                              onInput={(e) => {
                                updateTextElement(element.id, {
                                  text: e.currentTarget.textContent || ''
                                });
                              }}
                              onDoubleClick={(e) => e.stopPropagation()}
                            >
                              {element.text}
                            </div>
                            <button
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeTextElement(element.id)}
                            >
                              ×
                            </button>
                          </div>
                        </Draggable>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Document>
          </div>

          {/* Instruções */}
          {textElements.length === 0 && (
            <div className="mt-6 text-center text-muted-foreground">
              <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Clique em "Adicionar Texto" para começar a editar o PDF</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Edit;
